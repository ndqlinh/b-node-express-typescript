import { BaseResponse } from '@shared/helpers/response.helper';
import TodoService from '../services/todo.service';
import { Logger } from '@shared/helpers/logger.helper';

const todo = new TodoService();

export const createTask = async (event: any, _context: any): Promise<any> => {
  Logger.INFO('REQUEST', event);
  const { ownerId } = event;
  const requestBody = event.body;
  const result = await todo.create({ ...requestBody, ownerId });

  return BaseResponse.toSuccess(result);
};

export const updateTask = async (event: any, _context: any): Promise<any> => {
  const { ownerId } = event;
  const { id, newTodo } = event.body;
  const result = await todo.update(id, { ...newTodo, ownerId});

  return BaseResponse.toSuccess(result);
};

export const getTasks = async (event: any, _context: any): Promise<any> => {
  const { ownerId } = event;
  const todo = new TodoService();
  const list = await todo.list(ownerId);

  return BaseResponse.toSuccess(list);
};

export const findTask = async (event: any, _context: any): Promise<any> => {
  const { id } = event.pathParameters;
  const result = await todo.find(id);

  return BaseResponse.toSuccess(result);
};

export const deleteTask = async (event: any, _context: any): Promise<any> => {
  const { id } = event.body;
  await todo.delete(id);

  return BaseResponse.toSuccess({ msg: `#${id} was deleted successful` })
};
