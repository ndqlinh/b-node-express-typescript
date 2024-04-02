import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ApigatewayConstruct } from './aws-resources/api-gateway/api-gateway.construct';
import { apiResources } from './aws-resources/api-gateway/resources';

export class ApigatewayStack extends cdk.Stack {
  apigatewayConstruct: ApigatewayConstruct;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.apigatewayConstruct = new ApigatewayConstruct(
      this,
      'NodeExpressApigatewayConstruct'
    );
    this.apigatewayConstruct.loadParameters(this);
    this.apigatewayConstruct.loadApiGateway(
      this,
      this.apigatewayConstruct.ssmParams.restApiId,
      this.apigatewayConstruct.ssmParams.rootResourceId
    );
    this.apigatewayConstruct.createApiAuthorizer(this);
    this.apigatewayConstruct.createApiResources(this, apiResources);
  }
}
