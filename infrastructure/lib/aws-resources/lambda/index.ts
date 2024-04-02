import { todoFunctions } from './functions/todos';
import { authorizationFunction } from './functions/authorization';

export const lambdaFunctions = [
  authorizationFunction,
  ...todoFunctions
]
