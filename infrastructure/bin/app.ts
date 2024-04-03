#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ApigatewayStack, BaseStack, DynamodbStack, LambdaStack } from '../lib';
import { appConfig } from '@config/index';

const app = new cdk.App();
// Note: Stacks will be executed in A-Z order of stack id
new DynamodbStack(app, 'NodeExpress-A-DynamodbStack', {
  env: {
    account: appConfig.profile.accountId,
    region: appConfig.profile.region
  }
});

new BaseStack(app, 'NodeExpress-B-BaseStack', {
  env: {
    account: appConfig.profile.accountId,
    region: appConfig.profile.region
  }
});

new LambdaStack(app, 'NodeExpress-C-LambdaStack', {
  env: {
    account: appConfig.profile.accountId,
    region: appConfig.profile.region
  }
});

new ApigatewayStack(app, 'NodeExpress-D-ApigatewayStack', {
  env: {
    account: appConfig.profile.accountId,
    region: appConfig.profile.region
  }
});
