import { Logger } from '@shared/helpers/logger.helper';
import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const auth = new AuthService();
  const { authorizationToken, methodArn } = event;

  try {
    const token = authorizationToken.replace('Bearer', '').trim();
    const verificationResult: any = await auth.verifyToken(token);
    Logger.INFO('VERIFICATION RESULT', verificationResult);

    return generatePolicy('Allow', methodArn, {
      ownerId: verificationResult.id,
      email: verificationResult.email
    });
  } catch (err: any) {
    Logger.INFO('AUTHORIZE ERROR', err);
    const { statusCode, message, error } = err;
    return {
      statusCode,
      body: JSON.stringify({
        message,
        error
      })
    };
  }
});
