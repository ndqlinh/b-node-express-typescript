import { authorizationFunction } from './functions/authorization';
import { authFunctions } from './functions/accounts';
import { shopifyFunctions } from './functions/shopify';
import { profileFunctions } from './functions/profile';
import { taskFunctions } from './functions/tasks';

export const lambdaFunctions = [
  authorizationFunction,
  ...authFunctions,
  ...shopifyFunctions,
  ...profileFunctions,
  ...taskFunctions
]
