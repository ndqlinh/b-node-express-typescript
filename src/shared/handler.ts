import { Logger } from './helpers/logger.helper';
import { BaseResponse } from './helpers/response.helper';

export const wrapper =
  (handler: (event: any, context: any, callback: any) => Promise<any>): any =>
  async (event: any, context: any, callback: any) => {
    try {
      if (event.body) {
        event.body = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
      }

      const result = await handler({ ...event } as any, context, callback);
      Logger.INFO('HANDLER RESULT', result);
      return result as any;
    } catch (error) {
      return BaseResponse.toError(error);
    }
  };
