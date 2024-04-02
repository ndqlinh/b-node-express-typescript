import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { ACCOUNTS_TABLE_NAME } from '@db/dynamodb/tables';
import { DynamodbPermission } from '@common/types/dynamodb.type';

const lambdaOptions = {
  entry: 'accounts.controller.ts',
  auth: false,
  dynamodbTables: {
    [ACCOUNTS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  }
}

const accountRegistrationFunction = new LambdaFunction({
  ...lambdaOptions,
  functionName: 'AccountRegistration',
  handler: 'registerAccount',
  ssm: 'AccountRegistration',
  apiResourceMethod: 'POST',
  apiResourcePath: ROUTES.register
});

const accountSigninFunction = new LambdaFunction({
  ...lambdaOptions,
  functionName: 'AccountRegistration',
  handler: 'registerAccount',
  ssm: 'AccountRegistration',
  apiResourceMethod: 'POST',
  apiResourcePath: ROUTES.signin
});

export const accountFunctions = [
  accountRegistrationFunction,
  accountSigninFunction
]
