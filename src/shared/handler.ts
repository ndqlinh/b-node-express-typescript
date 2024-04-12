import AuthService from '../services/auth.service';
import { Logger } from './helpers/logger.helper';
import { BaseResponse } from './helpers/response.helper';

export const wrapper =
  (handler: (event: any, context: any, callback: any) => Promise<any>): any =>
  async (event: any, context: any, callback: any) => {
    try {
      if (event.body) {
        event.body = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
      }

      const authHeader = event?.authorizationToken;
      const token = authHeader && authHeader.split(' ')[1];

      const auth = new AuthService();
      const user= await auth.verifyToken(token);
      event.user = user;

      const result = await handler({ ...event } as any, context, callback);
      return result as any;
    } catch (error) {
      return BaseResponse.toError(error);
    }
  };
