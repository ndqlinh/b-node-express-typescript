import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { appConfig } from '@config/index';

const shopifyProxyFunction = new LambdaFunction({
  functionName: 'ShopifyProxy',
  entry: 'shopify.controller.ts',
  ssm: 'ShopifyProxy',
  apiResourceMethod: 'ANY',
  isApiProxy: true,
  apiResourcePath: ROUTES.shopifyProxy,
  apiKeyRequired: false,
  environment: {
    REGION: appConfig.profile.region
  }
});

export const shopifyFunctions = [
  shopifyProxyFunction
];
