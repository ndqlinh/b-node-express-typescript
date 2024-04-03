import { DynamodbPermission } from '@common/types/dynamodb.type';
import { LambdaFunction } from '../lambda.helper';
import { ACCOUNTS_TABLE_NAME } from '@db/dynamodb/tables';

export const authorizationFunction = new LambdaFunction({
  functionName: 'ApiAuthorizer',
  entry: 'authorizer.controller.ts',
  ssm: 'ApiAuthorizer',
  dynamodbTables: {
    [ACCOUNTS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  }
});
