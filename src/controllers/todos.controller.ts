import { wrapper } from '@shared/handler';
import { Logger } from '@shared/helpers/logger.helper';
import { BaseResponse } from '@shared/helpers/response.helper';

export const createTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const todo = event.body;
  Logger.INFO('TODO INPUT', todo);
  Logger.INFO('EVENT', event);
  return BaseResponse.toSuccess({ msg: 'Create Todo' });
});

export const updateTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  return BaseResponse.toSuccess({ msg: 'Update Todo' });
});

export const getTodos = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  return BaseResponse.toSuccess({ msg: 'Get Todo list' });
});

export const findTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  return BaseResponse.toSuccess({ msg: 'Find Todo' });
});
