import Joi from 'joi';
import { TodoModel } from '../models/todo.model';

export const TodoSchema: Joi.ObjectSchema<TodoModel> = Joi.object({
  id: Joi.string().allow(''),
  ownerId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  dueDate: Joi.string().allow(''),
  priority: Joi.string().allow('')
}).options({ allowUnknown: false });
