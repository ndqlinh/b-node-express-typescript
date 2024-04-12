import { Tables } from '@shared/enums/tables.enum';
import DynamoDBConnector from '../shared/helpers/dynamodb.helper';
import { Account } from '../models/account.model';

export class AccountRepository {
  private readonly dbConnector: DynamoDBConnector;

  constructor() {
    this.dbConnector = new DynamoDBConnector();
  }

  async save(input) {
    const result = await this.dbConnector.put(Tables.ACCOUNTS, input);
    return result;
  }

  async findByEmail(email: string) {
    const params = {
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
    };
    const accounts: Account[] = await this.dbConnector.query(Tables.ACCOUNTS, params);
    return accounts?.[0];
  }
}
