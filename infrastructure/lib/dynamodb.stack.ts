import { dynamodbTables } from '@db/dynamodb';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamodbConstruct } from './aws-resources/dynamodb/dynamodb.construct';

export class DynamodbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbConstruct = new DynamodbConstruct(scope, 'NodeExpressDynamodbConstruct');
    dbConstruct.createTables(this, dynamodbTables);
  }
}
