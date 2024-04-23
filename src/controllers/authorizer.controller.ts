import { Logger } from '@shared/helpers/logger.helper';
import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const auth = new AuthService();
  const { authorizationToken, methodArn } = event;

  try {
    const verificationResult: any = await auth.verifyToken(authorizationToken.split(' ')[1]);
    Logger.INFO('VERIFICATION', verificationResult);

    return generatePolicy(
      'Allow',
      methodArn,
      verificationResult.email && {
        ownerId: verificationResult.id,
        email: verificationResult.email
      }
    );
  } catch (err) {
    Logger.INFO('AUTHORIZE ERROR', err);
    return generatePolicy('Deny', methodArn)
  }
});
