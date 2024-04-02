import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { HttpMethods } from '@common/types/common.type';
import { DynamodbPermission } from '@common/types/dynamodb.type';

type FunctionMemorySize = 128 | 256 | 512 | 1024;

export interface LambdaFunctionProps {
  functionName: string;
  entry: string;
  handler?: string;
  runtime?: Runtime;
  timeout?: number;
  memorySize?: FunctionMemorySize;
  environment?: {
    [key: string]: string;
  };
  ssm?: string;
  dynamodbTables?: { [tableName: string]: DynamodbPermission[] };
  customPolicies?: PolicyStatement[];
  auth?: boolean;
  apiResourcePath?: string;
  isApiProxy?: boolean;
  apiResourceMethod?: HttpMethods;
  apiKeyRequired?: boolean;
}

export class LambdaFunction implements LambdaFunctionProps {
  functionName: string;
  entry: string;
  handler?: string;
  runtime?: Runtime;
  timeout?: number;
  memorySize?: FunctionMemorySize;
  ssm?: string;
  dynamodbTables?: { [tableName: string]: DynamodbPermission[] };
  customPolicies?: PolicyStatement[];
  auth?: boolean;
  apiResourcePath?: string;
  isApiProxy?: boolean;
  apiResourceMethod?: HttpMethods;
  apiKeyRequired?: boolean;

  constructor(data: LambdaFunctionProps) {
    this.functionName = `NodeExpress${data.functionName}Function`;
    this.entry = `src/controllers/${data.entry}`;
    this.handler = data.handler || 'handler';
    this.runtime = data.runtime || Runtime.NODEJS_20_X;
    this.timeout = data.timeout || 30;
    this.memorySize = data.memorySize || 128;
    this.ssm = data.ssm ? `NodeExpress${data.ssm}` : undefined;
    this.dynamodbTables = this.changeDynamodbTablesKey(data.dynamodbTables);
    this.customPolicies = data.customPolicies;
    this.auth = data.auth;
    this.apiResourcePath = data.apiResourcePath;
    this.isApiProxy = data.isApiProxy;
    this.apiResourceMethod = data.apiResourceMethod;
    this.apiKeyRequired = data.apiKeyRequired;
  }

  changeDynamodbTablesKey(dynamodbTables: { [tableName: string]: DynamodbPermission[] }) {
    if (!dynamodbTables) return undefined;
    const newDynamodbTables: { [tableName: string]: DynamodbPermission[] } = {};
    for (const [key, value] of Object.entries(dynamodbTables)) {
      newDynamodbTables[`NodeExpress${key}Table`] = value;
    }
    return newDynamodbTables;
  }
}
