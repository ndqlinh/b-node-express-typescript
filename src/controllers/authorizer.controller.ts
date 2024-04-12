import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { authorizationToken, methodArn } = event;
  const auth = new AuthService();

  try {
    const account = await auth.verifyToken(authorizationToken);
    callback(null, generatePolicy('Allow', methodArn, { account }));
  } catch (error) {
    console.log('Authorizer error: ', error);
    callback('Unauthorized', generatePolicy('Deny', methodArn));
  }
});
