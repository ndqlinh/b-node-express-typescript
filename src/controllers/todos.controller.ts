import { HTTPStatus } from './../shared/enums/http.enum';
import { wrapper } from '@shared/handler';
import { Logger } from '@shared/helpers/logger.helper';
import { BaseResponse } from '@shared/helpers/response.helper';
import TodoService from '../services/todo.service';

export const createTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { ownerId } = event;
  const requestBody = event.body;
  const todo = new TodoService();
  const result = await todo.create({ ...requestBody, ownerId });

  return BaseResponse.toSuccess(result);
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
