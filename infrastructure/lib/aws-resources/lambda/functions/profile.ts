import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { DynamodbPermission } from '@common/types/dynamodb.type';
import { ACCOUNTS_TABLE_NAME } from '@db/dynamodb/tables';

const lambdaOpions = {
  entry: 'profile.controller.ts',
  auth: true,
  dynamodbTables: {
    [ACCOUNTS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  }
};

const profileDetailFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'ProfileDetail',
  handler: 'getProfileDetail',
  ssm: 'ProfileDetail',
  apiResourceMethod: 'GET',
  apiResourcePath: ROUTES.profile
});

export const profileFunctions = [
  profileDetailFunction
];
