import { wrapper } from '@shared/handler';
import { BaseResponse } from '@shared/helpers/response.helper';
import TodoService from '../services/todo.service';

const todo = new TodoService();

export const createTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { ownerId } = event;
  const requestBody = event.body;
  const result = await todo.create({ ...requestBody, ownerId });

  return BaseResponse.toSuccess(result);
});

export const updateTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { ownerId } = event;
  const { id, newTodo } = event.body;
  const result = await todo.update(id, { ...newTodo, ownerId});

  return BaseResponse.toSuccess(result);
});

export const getTodos = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { ownerId } = event;
  const todo = new TodoService();
  const list = await todo.list(ownerId);
  return BaseResponse.toSuccess(list);
});

export const findTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { id } = event.pathParameters;
  const result = await todo.find(id);
  return BaseResponse.toSuccess(result);
});

export const deleteTodo = wrapper(async (event: any, _context: any, callback): Promise<any> => {
  const { id } = event.body;
  await todo.delete(id);
  return BaseResponse.toSuccess({ msg: `#${id} was deleted succesful` })
});
