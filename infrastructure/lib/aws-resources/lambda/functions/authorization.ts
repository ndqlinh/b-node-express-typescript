import { DynamodbPermission } from '@common/types/dynamodb.type';
import { LambdaFunction } from '../lambda.helper';
import { ACCOUNTS_TABLE_NAME } from '@db/dynamodb/tables';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const authorizationFunction = new LambdaFunction({
  functionName: 'ApiAuthorizer',
  entry: 'authorizer.controller.ts',
  ssm: 'ApiAuthorizer',
  dynamodbTables: {
    [ACCOUNTS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  },
  customPolicies: [
    new PolicyStatement({
      actions: [
        'ssm:GetParameterHistory',
        'ssm:GetParametersByPath',
        'ssm:GetParameters',
        'ssm:GetParameter'
      ],
      resources: ['*']
    })
  ]
});
