import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';

const callbackFunction = new LambdaFunction({
  functionName: 'CarrierCallback',
  entry: 'shopify.controller.ts',
  handler: 'onCheckout',
  ssm: 'CarrierCallback',
  apiResourceMethod: 'POST',
  apiResourcePath: ROUTES.shopify
});

export const shopifyFunctions = [
  callbackFunction
];
