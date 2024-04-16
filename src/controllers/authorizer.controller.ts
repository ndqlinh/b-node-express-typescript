import { Logger } from '@shared/helpers/logger.helper';
import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const auth = new AuthService();
  const { authorizationToken, methodArn, user } = event;

  Logger.INFO('USER ACCOUNT', user);

  try {
    const isVerified: any = await auth.verifyToken(authorizationToken.split(' ')[1]);
    Logger.INFO('VERIFICATION', isVerified);

    if (isVerified.email)  {
      callback(null, generatePolicy('Allow', methodArn, { account: user }));
    } else {
      callback('Unauthorized', generatePolicy('Deny', methodArn));
    }
  } catch (err) {
    Logger.INFO('AUTHORIZE ERROR', err);
    callback('Unauthorized', generatePolicy('Deny', methodArn));
  }
});
