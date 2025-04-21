import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';

const lambdaOptions = {
  entry: 'crawler.controller.ts',
  apiResourcePath: ROUTES.crawler,
};

const crawlMutlpleUrlsFunction = new LambdaFunction({
  ...lambdaOptions,
  functionName: 'MultipleUrlsCrawler',
  handler: 'crawlMultipleUrls',
  ssm: 'MultipleUrlsCrawler',
  apiResourceMethod: 'POST',
  memorySize: 1024,
  timeout: 900,
});

export const crawlerFunctions = [crawlMutlpleUrlsFunction];
