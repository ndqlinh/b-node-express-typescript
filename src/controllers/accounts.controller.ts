import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import { ROUTES } from '@config/routes';
import { Logger } from '@shared/helpers/logger.helper';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post(ROUTES.register, async (req: Request, res: Response, next) => {
  const userInfo = req.body;
  Logger.INFO('request body', userInfo);
  res.send({ code: 200, message: 'Register successful' });
});

app.post(ROUTES.signin, async (req: Request, res: Response, next) => {
  const account = req.body;
  Logger.INFO('request body', account);
  res.send({ code: 200, message: 'Signin successful' });
});

export const handler = serverless(app);
