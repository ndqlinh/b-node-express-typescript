import { authorizationFunction } from './functions/authorization';
import { authFunctions } from './functions/accounts';
import { shopifyFunctions } from './functions/shopify';
import { profileFunctions } from './functions/profile';
import { taskFunctions } from './functions/tasks';
import { crawlerFunctions } from './functions/crawler';
import { telegramFunction } from './functions/telegram';

export const lambdaFunctions = [
  authorizationFunction,
  telegramFunction,
  ...authFunctions,
  ...shopifyFunctions,
  ...profileFunctions,
  ...taskFunctions,
  ...crawlerFunctions,
];
