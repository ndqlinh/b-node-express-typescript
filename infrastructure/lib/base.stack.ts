import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { appConfig } from '@config/index';
import { ApigatewayConstruct } from './aws-resources/api-gateway/api-gateway.construct';

export class BaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const apigatewayConstruct = new ApigatewayConstruct(
      this,
      'NodeExpressApigatewayConstruct'
    );
    apigatewayConstruct.createApiGateway(this);
    // apigatewayConstruct.createAuthenticationLambda(this);
  }
}
