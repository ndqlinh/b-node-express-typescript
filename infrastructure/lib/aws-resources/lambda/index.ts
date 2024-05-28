import { authorizationFunction } from './functions/authorization';
import { authFunctions } from './functions/accounts';
import { todoFunctions } from './functions/todos';
import { shopifyFunctions } from './functions/shopify';
import { profileFunctions } from './functions/profile';

export const lambdaFunctions = [
  authorizationFunction,
  ...authFunctions,
  ...todoFunctions,
  ...shopifyFunctions,
  ...profileFunctions
]
