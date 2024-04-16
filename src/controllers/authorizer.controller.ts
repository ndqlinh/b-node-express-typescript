import { wrapper } from '../shared/handler';
import { generatePolicy } from '../shared/utils/policy.util';

export const handler = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { methodArn, user } = event;

  if (user) {
    callback(null, generatePolicy('Allow', methodArn, { account: user }));
  } else {
    callback('Unauthorized', generatePolicy('Deny', methodArn));
  }
});
