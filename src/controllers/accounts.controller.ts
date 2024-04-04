import { wrapper } from '@shared/handler';
import { BaseResponse } from '@shared/helpers/response.helper';

export const registerAccount = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  return BaseResponse.toSuccess({ msg: 'Register Account' });
});

export const signinAccount = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  return BaseResponse.toSuccess({ msg: 'Signin Account' });
});
