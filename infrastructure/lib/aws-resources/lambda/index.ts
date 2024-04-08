import { todoFunctions } from './functions/todos';
import { authorizationFunction } from './functions/authorization';
import { authFunctions } from './functions/accounts';

export const lambdaFunctions = [
  authorizationFunction,
  ...authFunctions,
  ...todoFunctions
]
