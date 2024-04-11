import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { ACCOUNTS_TABLE_NAME } from '@db/dynamodb/tables';
import { DynamodbPermission } from '@common/types/dynamodb.type';
import { appConfig } from '@config/index';

const authProxyFunction = new LambdaFunction({
  functionName: 'AuthProxy',
  entry: 'accounts.controller.ts',
  ssm: 'AuthProxy',
  apiResourceMethod: 'ANY',
  isApiProxy: true,
  apiResourcePath: ROUTES.auth,
  apiKeyRequired: false,
  environment: {
    REGION: appConfig.profile.region,
    SSM_TOKEN_SECRET: appConfig.ssm.tokenSecret
  },
  dynamodbTables: {
    [ACCOUNTS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  }
});

export const authFunctions = [authProxyFunction];
