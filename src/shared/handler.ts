import { BaseResponse } from './helpers/response.helper';
import { authorizer } from './utils/jwt.util';

export const wrapper =
  (handler: (event: any, context: any, callback: any) => Promise<any>): any =>
  async (event: any, context: any, callback: any) => {
    try {
      if (event.body) {
        event.body = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
      }

      const authHeader = event?.headers?.Authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const user= await authorizer(token);
      event.user = user;

      const result = await handler({ ...event } as any, context, callback);
      return result as any;
    } catch (error) {
      return BaseResponse.toError(error);
    }
  };
