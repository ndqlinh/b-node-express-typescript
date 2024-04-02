import { LambdaFunction } from '../lambda.helper';

export const authorizationFunction = new LambdaFunction({
  functionName: 'ApiAuthorizer',
  entry: 'authorizer.controller.ts',
  ssm: 'ApiAuthorizer'
});
