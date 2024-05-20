import { Model } from './model';

export type Todo = {
  id?: string;
  ownerId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'new' | 'in-progress' | 'done';
}

export class TodoModel extends Model implements Todo {
  ownerId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'new' | 'in-progress' | 'done';

  constructor(todo: Todo) {
    super();

    this.ownerId = todo.ownerId || '';
    this.title = todo.title || '';
    this.description = todo.description || '';
    this.dueDate = todo.dueDate || '';
    this.priority = todo.priority || 'low';
    this.status = todo.status || 'new';
  }
}
