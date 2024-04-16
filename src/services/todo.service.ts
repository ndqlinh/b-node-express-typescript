import { validateSchema } from '@shared/utils/validate.utils';
import { Todo, TodoModel } from '../models/todo.model';
import { TodoRepository } from '../repositories/todo.repository';
import { TodoSchema } from '../validators/todo.schema';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

export default class TodoService {
  private readonly todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async create(todoInput: Todo): Promise<any> {
    await validateSchema(TodoSchema, todoInput);

    try {
      const todoModel = new TodoModel(todoInput);
      const todo = await this.todoRepository.save(todoModel);

      return {
        code: HTTPStatus.OK,
        data: todo
      };
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Create todo failed', error);
    }
  }

  async list(ownerId: string): Promise<any> {
    try {
      const todos = await this.todoRepository.findByOwnerId(ownerId);

      return {
        code: HTTPStatus.OK,
        data: todos
      };
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Create todo failed', error);
    }
  }
 }