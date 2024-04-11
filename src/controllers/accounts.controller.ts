import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ROUTES } from '@config/routes';
import AccountService from '../services/account.service';
import { Logger } from '@shared/helpers/logger.helper';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(ROUTES.register, async (req: Request, res: Response, next) => {
  const userInfo = req.body;
  Logger.INFO('request body', userInfo);
  const account = new AccountService();
  try {
    const registeredAcount = account.register(userInfo);
    res.send({ code: 200, data: registeredAcount });
  } catch (err) {
    throw new HttpException(
      HTTPStatus.INTERNAL_SERVER_ERROR,
      'Failed to register'
    );
  }
});

app.post(ROUTES.signin, async (req: Request, res: Response, next) => {
  const account = req.body;
  Logger.INFO('request body', account);
  res.send({ code: 200, message: 'Signin successful' });
});

export const handler = serverless(app);
