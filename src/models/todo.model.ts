import { Model } from './model';

export type Todo = {
  id?: string;
  ownerId: string;
  title: string;
  description: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export class TodoModel extends Model implements Todo {
  ownerId: string;
  title: string;
  description: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';

  constructor(todo: Todo) {
    super();

    this.ownerId = todo.ownerId || '';
    this.title = todo.title || '';
    this.description = todo.description || '';
    this.dueDate = todo.dueDate || '';
    this.priority = todo.priority || 'low';
  }
}
