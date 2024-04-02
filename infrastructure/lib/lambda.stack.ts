import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { lambdaFunctions } from './aws-resources/lambda';
import { LambdaConstruct } from './aws-resources/lambda/lambda.construct';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const lambdaConstruct = new LambdaConstruct(this, 'NodeExpressLambdaConstruct');
    lambdaConstruct.createLambdaFunctions(this, lambdaFunctions);
  }
}
