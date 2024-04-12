import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ROUTES } from '@config/routes';
import AccountService from '../services/account.service';
import { Logger } from '@shared/helpers/logger.helper';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import AuthService from '../services/auth.service';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(ROUTES.register, async (req: Request, res: Response, next) => {
  const userInfo = req.body;
  const account = new AccountService();
  try {
    const registeredAcount = await account.register(userInfo);
    res.send({ code: 200, data: registeredAcount });
  } catch (error) {
    throw new HttpException(
      HTTPStatus.INTERNAL_SERVER_ERROR,
      'Failed to register',
      error
    );
  }
});

app.post(ROUTES.signin, async (req: Request, res: Response, next) => {
  try {
    const account = new AccountService();
    const verifiedAccount = await account.verify(req.body);
    const result = await account.login(verifiedAccount);

    res.send({ code: 200, data: result });
  } catch (error) {
    throw new HttpException(
      HTTPStatus.INTERNAL_SERVER_ERROR,
      'Failed to login',
      error
    );
  }
});

export const handler = serverless(app);
