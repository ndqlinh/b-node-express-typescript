import { Logger } from '@shared/helpers/logger.helper';
import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';
import { Context } from 'aws-lambda';

export const handler = wrapper(async (event: any, context: Context, callback): Promise<any> => {
  const auth = new AuthService();
  const { authorizationToken, methodArn } = event;

  try {
    const token = authorizationToken.replace('Bearer', '').trim();
    const verificationResult: any = await auth.verifyToken(token);
    Logger.INFO('VERIFICATION RESULT', verificationResult);
    const policy = generatePolicy('Allow', methodArn);
    callback(null, policy, {
      ownerId: verificationResult.id,
      email: verificationResult.email
    });
  } catch (err: any) {
    Logger.INFO('AUTHORIZE ERROR', err);
    callback('Unauthorized');
  }
});
