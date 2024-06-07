import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { PASSPORT_NAMESPACE } from '@shared/constants';
import { Logger } from '@shared/helpers/logger.helper';

export const passportAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  return passport.authenticate(PASSPORT_NAMESPACE, (error, user, message) => {
    Logger.INFO('Callback authentication middleware: ', { user, message, error });
    if (error) {
      // Redirect failure
      return res.redirect(`https://${process.env.DOMAIN}/account/login`);
    }
    req.user = user || {};
    next();
  })(req, res, next);
};
