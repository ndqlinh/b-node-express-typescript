import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { DynamodbPermission } from '@common/types/dynamodb.type';
import { ACCOUNTS_TABLE_NAME } from '@db/dynamodb/tables';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const lambdaOpions = {
  entry: 'profile.controller.ts',
  auth: true,
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
};

const profileDetailFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'ProfileDetail',
  handler: 'getProfileDetail',
  ssm: 'ProfileDetail',
  apiResourceMethod: 'GET',
  apiResourcePath: ROUTES.profile
});

const profileUpdateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'ProfileUpdate',
  handler: 'updateProfile',
  ssm: 'ProfileUpdate',
  apiResourceMethod: 'PUT',
  apiResourcePath: ROUTES.profile
});

const profilePasswordUpdateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'PasswordUpdate',
  handler: 'updatePassword',
  ssm: 'PasswordUpdate',
  apiResourceMethod: 'PUT',
  apiResourcePath: ROUTES.resetPassword
});

export const profileFunctions = [
  profileDetailFunction,
  profileUpdateFunction,
  profilePasswordUpdateFunction
];
