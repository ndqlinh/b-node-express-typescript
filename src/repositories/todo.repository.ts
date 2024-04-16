import { Tables } from '@shared/enums/tables.enum';
import DynamoDBConnector from '../shared/helpers/dynamodb.helper';
import { Todo } from '../models/todo.model';

export class TodoRepository {
  private readonly dbConnector: DynamoDBConnector;

  constructor() {
    this.dbConnector = new DynamoDBConnector();
  }

  async save(input: Todo) {
    const result = await this.dbConnector.put(Tables.TODOS, input);
    return result;
  }

  async findByOwnerId(ownerId: string) {
    const params = {
      KeyConditionExpression: 'ownerId = :ownerId',
      ExpressionAttributeValues: { ':ownerId': ownerId }
    };
    const todos: Todo[] = await this.dbConnector.query(Tables.TODOS, params);
    return todos;
  }

  async deleteById(id: string) {
    await this.dbConnector.delete(Tables.TODOS, { id });
    return true;
  }
}
