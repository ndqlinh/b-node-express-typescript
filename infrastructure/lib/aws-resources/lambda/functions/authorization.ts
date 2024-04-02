import { LambdaFunction } from '../lambda.helpers';

export const authorizationFunction = new LambdaFunction({
  functionName: 'ApiAuthorizer',
  entry: 'authorizer.controller.ts',
  ssm: 'ApiAuthorizer'
});
