#!/usr/bin/env node
import { appConfig } from '@config/index';
import * as cdk from 'aws-cdk-lib';
import { RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import 'source-map-support/register';

import { ApigatewayConstruct } from '../lib/aws-resources/api-gateway/api-gateway.construct';
import { apiResources } from '../lib/aws-resources/api-gateway/resources';
import { lambdaFunctions } from '../lib/aws-resources/lambda';
import { LambdaConstruct } from '../lib/aws-resources/lambda/lambda.construct';

class DevelopmentStack extends cdk.Stack {
  restApi: RestApi;
  authorizer: TokenAuthorizer;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Create API Gateway
    const apigatewayConstruct = new ApigatewayConstruct(
      this,
      'NodeExpressApigatewayConstruct'
    );
    apigatewayConstruct.createApiGateway(this);

    // Create Lambda Functions
    const lambdaConstruct = new LambdaConstruct(this, 'NodeExpressLambdaConstruct');
    const funcs = lambdaConstruct.createLambdaFunctions(this, [...lambdaFunctions]);

    // Create API Resources
    apigatewayConstruct.createApiAuthorizer(this);
    apigatewayConstruct.createApiResources(this, apiResources, funcs);
  }
}

const app = new cdk.App();
// Note: Stacks will be executed in A-Z order of stack id
new DevelopmentStack(app, 'DevelopmentStack', {
  env: {
    account: appConfig.profile.accountId,
    region: appConfig.profile.region
  }
});
