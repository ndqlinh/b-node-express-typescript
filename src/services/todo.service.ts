import { validateSchema } from '@shared/utils/validate.utils';
import { Todo, TodoModel } from '../models/todo.model';
import { TodoRepository } from '../repositories/todo.repository';
import { TodoSchema } from '../validators/todo.schema';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';

export default class TodoService {
  private readonly todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async create(todoInput: Todo): Promise<Todo> {
    await validateSchema(TodoSchema, todoInput);

    try {
      const todoModel = new TodoModel(todoInput);
      const todo = await this.todoRepository.save(todoModel);

      return todo;
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Create todo failed', error);
    }
  }

  async list(ownerId: string): Promise<Todo[]> {
    try {
      const todos = await this.todoRepository.findByOwnerId(ownerId);
      return todos;
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Get todo list failed', error);
    }
  }

  async update(id: string, todoInput: Todo): Promise<Todo> {
    if (!id) {
      throw new HttpException(HTTPStatus.BAD_REQUEST, 'Missing todo id');
    }

    await validateSchema(TodoSchema, todoInput);
    try {
      const todoModel = new TodoModel(todoInput);
      const todo = await this.todoRepository.save({...todoModel, id});
      return todo;
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Update todo failed', error);
    }
  }
 }
