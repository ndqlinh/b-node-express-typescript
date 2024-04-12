import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ROUTES } from '@config/routes';
import AccountService from '../services/account.service';
import { StatusCodes } from '@common/enums/status-codes.enum';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(ROUTES.register, async (req: Request, res: Response, next) => {
  const userInfo = req.body;
  const account = new AccountService();
  const registeredAcount = await account.register(userInfo);
  return res.send({ code: StatusCodes.Ok, data: registeredAcount });
});

app.post(ROUTES.signin, async (req: Request, res: Response, next) => {
  const account = new AccountService();
  const verifiedAccount = await account.verify(req.body);
  const result = await account.login(verifiedAccount);
  return res.send({ code: StatusCodes.Ok, data: result });
});

export const handler = serverless(app);
