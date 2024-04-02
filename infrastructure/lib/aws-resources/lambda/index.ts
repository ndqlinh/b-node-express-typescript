import { todoFunctions } from './functions/todos';
import { authorizationFunction } from './functions/authorization';
import { accountFunctions } from './functions/accounts';

export const lambdaFunctions = [
  authorizationFunction,
  ...accountFunctions,
  ...todoFunctions
]
