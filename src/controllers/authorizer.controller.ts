import { Logger } from '@shared/helpers/logger.helper';
import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const auth = new AuthService();
  const { authorizationToken, methodArn } = event;

  try {
    const verifiedAccount: any = await auth.verifyToken(authorizationToken.split(' ')[1]);
    Logger.INFO('VERIFICATION', verifiedAccount);
    if (verifiedAccount.email) {
      generatePolicy('Allow', methodArn, { ownerId: verifiedAccount.id, email: verifiedAccount.email })
    } else {
      generatePolicy('Deny', methodArn)
    }
  } catch (err) {
    Logger.INFO('AUTHORIZE ERROR', err);
    generatePolicy('Deny', methodArn)
  }
});
