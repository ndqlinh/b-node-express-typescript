import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ROUTES } from '@config/routes';
import AccountService from '../services/account.service';
import AuthService from '../services/auth.service';
import { HTTPStatus } from '@shared/enums/http.enum';
import cors from 'cors';

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
  const account = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const auth = new AuthService();
  const isVerified: any = await auth.verifyToken(token);

  if (isVerified.email !== account.email) {
    return res.status(HTTPStatus.UNAUTHORIZED).send({ message: 'Invalid token' });
  }

  const newTokens = await auth.renewToken(account, token);
  return res.status(HTTPStatus.ACCEPTED).send({ ...newTokens });
});

export const handler = serverless(app);
