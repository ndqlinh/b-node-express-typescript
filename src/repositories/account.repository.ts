import { Tables } from '@shared/enums/tables.enum';
import DynamoDBConnector from '../shared/helpers/dynamodb.helper';

export class AccountRepository {
  private readonly dbConnector: DynamoDBConnector;

  constructor() {
    this.dbConnector = new DynamoDBConnector();
  }

  async save(input) {
    const result = await this.dbConnector.put(Tables.ACCOUNTS, input);
    return result;
  }

  async find(email) {
    const params = {
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    };
    const result = await this.dbConnector.query(Tables.ACCOUNTS, params);
    return result?.[0];
  }
}
