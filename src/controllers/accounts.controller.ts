import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import serverless from 'serverless-http';
import passport from 'passport';
import crypto from 'crypto';
import { sign } from 'jsonwebtoken';

import AccountService from '../services/account.service';
import AuthService from '../services/auth.service';
import SsoService from '../services/sso.service';
import { ROUTES } from '@config/routes';
import { HTTPStatus } from '@shared/enums/http.enum';
import { PASSPORT_NAMESPACE } from '@shared/constants';
import { passportAuthenticate } from '../middlewares/auth.middleware';
import { Logger } from '@shared/helpers/logger.helper';
import ProfileService from '../services/profile.service';
import SsmHelper from '@shared/helpers/ssm.helper';
import { AccountRepository } from '../repositories/account.repository';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false, // or true if you want to save the session even if it wasn't modified
    saveUninitialized: true, // or true if you want to save a new session that hasn't been modified
  })
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: any, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj: any, cb) => {
  cb(null, obj);
});

app.post(ROUTES.register, async (req: Request, res: Response, next) => {
  const userInfo = req.body;

  if (userInfo.password === userInfo.confirmPassword) {
    delete userInfo.confirmPassword;
  } else {
    return res
      .status(HTTPStatus.BAD_REQUEST)
      .send({ message: 'Password is not matched' });
  }

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
  const { token } = req.body;
  const auth = new AuthService();
  const verifiedResult: any = await auth.verifyToken(token);

  if (!verifiedResult.id) {
    return res
      .status(verifiedResult.statusCode)
      .send({ message: verifiedResult.message });
  }

  const newAccessToken = await auth.renewToken(verifiedResult, token);
  return res.status(HTTPStatus.OK).send({ data: newAccessToken });
});

app.get(
  ROUTES.sso,
  async (req: Request, res: Response, next) => {
    const queryParams = req.query;

    try {
      const sso = new SsoService();
      const strategy = await sso.getStrategy(
        queryParams.idp as 'google' | 'line'
      );
      passport.use(PASSPORT_NAMESPACE, strategy);
    } catch (error) {
      Logger.ERROR('Error when apply passport strategy: ', { error });
      return res.send(HTTPStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Error when apply passport strategy',
      });
    }
    next();
  },
  passport.authenticate(PASSPORT_NAMESPACE)
);

app.post(ROUTES.authorization, async (req: Request, res: Response, next) => {
  const { code } = req.body;
  const auth = new AuthService();

  const verifiedResult: any = await auth.verifyToken(code);

  if (!verifiedResult.email) {
    return res
      .status(HTTPStatus.UNAUTHORIZED)
      .send({ message: verifiedResult.message });
  }

  const accountRepository = new AccountRepository();
  const account = new AccountService();
  const user = await accountRepository.findByEmail(verifiedResult.email);
  const authenticatedInfo = await account.login(user);

  return res.status(HTTPStatus.OK).send({ data: authenticatedInfo.data });
});

const handleSsoCallback = async (req: Request, res: Response) => {
  Logger.INFO('SSO Callback Handler', req.user);
  const user: any = req.user;
  const profile = new ProfileService();
  const account = new AccountService();
  const ssmHelper = new SsmHelper();
  const appDomain = await ssmHelper.getParams('NodeExpressAppDomain');
  const tokenSecret = await ssmHelper.getParams('NodeExpressTokenSecret');
  const existingAccount = await profile.findByEmail(user?.email);
  let code: string = '';

  if (existingAccount) {
    await profile.updateProfileByEmail(user.email, {
      firstName: user.given_name || user.displayName,
      lastName: user.family_name,
    });
    code = sign(
      {
        email: user.email,
        id: existingAccount.id,
      },
      tokenSecret,
      { expiresIn: '30s' }
    );
    return res.redirect(`${appDomain}/auth/authorize?code=${code}`);
  } else {
    // Create new user
    const newAccount = {
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      password: crypto.randomBytes(32).toString('hex'),
      isSso: true,
    };
    const registeredAccount = await account.register(newAccount);
    if (registeredAccount.code === HTTPStatus.OK) {
      code = sign(
        {
          email: user.email,
          id: registeredAccount.data.id,
        },
        tokenSecret,
        { expiresIn: '30s' }
      );
      return res.redirect(`${appDomain}/auth/authorize?code=${code}`);
    }
  }
};

app.get(ROUTES.ssoCallback, passportAuthenticate, handleSsoCallback);
app.post(ROUTES.ssoCallback, passportAuthenticate, handleSsoCallback);

export const handler = serverless(app);
