import { wrapper } from '@shared/handler';
import { Logger } from '@shared/helpers/logger.helper';
import { BaseResponse } from '@shared/helpers/response.helper';

export const onCheckout = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  // const requestBody = JSON.stringify(event.body);
  Logger.INFO('REQUEST BODY', event);

  return BaseResponse.toSuccess('success');
});
