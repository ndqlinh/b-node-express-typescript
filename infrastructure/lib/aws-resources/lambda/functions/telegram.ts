import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';

export const telegramFunction = new LambdaFunction({
  functionName: 'ApiTelegram',
  entry: 'telegram.controller.ts',
  ssm: 'ApiTelegram',
  apiResourcePath: ROUTES.telegramWebhook,
  apiResourceMethod: 'ANY',
  isApiProxy: true,
  apiKeyRequired: false,
  environment: {
    TELEGRAM_BOX_TOKEN: process.env.TELEGRAM_BOX_TOKEN || 'hello-token',
  },
  memorySize: 1024,
  timeout: 900,
  customPolicies: [
    new PolicyStatement({
      actions: [
        'ssm:GetParameterHistory',
        'ssm:GetParametersByPath',
        'ssm:GetParameters',
        'ssm:GetParameter',
      ],
      resources: ['*'],
    }),
  ],
});
