import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ROUTES } from '@config/routes';
import AccountService from '../services/account.service';
import AuthService from '../services/auth.service';
import { HTTPStatus } from '@shared/enums/http.enum';
import cors from 'cors';
import { Logger } from '@shared/helpers/logger.helper';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(ROUTES.register, async (req: Request, res: Response, next) => {
  const userInfo = req.body;
  const account = new AccountService();
  const registeredAcount = await account.register(userInfo);
  return res.status(registeredAcount.code).send(registeredAcount);
});

app.post(ROUTES.signin, async (req: Request, res: Response, next) => {
  const account = new AccountService();
  const verifyResult = await account.verify(req.body);
  if (verifyResult.email) {
    const result = await account.login(verifyResult);
    return res.status(result.code).send(result);
  } else {
    return res.status(verifyResult.code).send(verifyResult);
  }
});

app.post(ROUTES.renew, async (req: Request, res: Response, next) => {
  const { token } = req.body
  const auth = new AuthService();
  const verifiedResult: any = await auth.verifyToken(token);

  if (!verifiedResult.id) {
    return res.status(verifiedResult.statusCode).send({ message: verifiedResult.message });
  }

  const newAccessToken = await auth.renewToken(verifiedResult, token);
  return res.status(HTTPStatus.ACCEPTED).send({ data: newAccessToken });
});

export const handler = serverless(app);
