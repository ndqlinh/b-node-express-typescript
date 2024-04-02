import { wrapper } from '../shared/handler';
import { authorizer } from '../shared/utils/jwt.util';
import { generatePolicy } from '../shared/utils/policy.util';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { authorizationToken, methodArn } = event;

  try {
    const account = await authorizer(authorizationToken);
    callback(null, generatePolicy('Allow', methodArn, { account }));
  } catch (error) {
    console.log('Authorizer error: ', error);
    callback('Unauthorized', generatePolicy('Deny', methodArn));
  }
});
