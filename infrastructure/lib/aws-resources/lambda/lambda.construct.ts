import { Duration } from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { DynamodbPermission } from '@common/types/dynamodb.type';
import { appConfig } from '@config/index';
import { getDynamodbTables } from '../dynamodb/dynamodb.utils';
import { getParameter, putParameter } from '../ssm/ssm.util';
import { LambdaFunction } from './lambda.helpers';

export class LambdaConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  createLambdaFunctions(scope: Construct, functions: LambdaFunction[]) {
    // Load DynamoDB Tables
    const dynamodbTables = getDynamodbTables(scope);
    const defaultEnvironments: any = {
      ENVIRONMENT: process.env.ENVIRONMENT || 'dev',
      REST_API_ID: getParameter(scope, appConfig.ssm.restApiId)
    };
    // Create Lambda Function
    const result: { [key: string]: NodejsFunction } = {};
    functions.map((func: LambdaFunction) => {
      const lambda = new NodejsFunction(this, func.functionName, {
        entry: func.entry,
        handler: func.handler,
        functionName: func.functionName,
        runtime: func.runtime,
        timeout: Duration.seconds(func.timeout || 30),
        memorySize: func.memorySize,
        bundling: {
          target: 'es2020',
          sourceMap: false,
          minify: true
        }
      });

      // Grant DynamoDB Access Permissions
      if (func.dynamodbTables) {
        Object.keys(dynamodbTables).map((tableName: string) => {
          const permissions = func.dynamodbTables![tableName] || [];
          permissions.map((permission: DynamodbPermission) => {
            if (permission === DynamodbPermission.READ_WRITE) {
              dynamodbTables[tableName]?.table?.grantReadWriteData(lambda);
            }
            if (permission === DynamodbPermission.READ) {
              dynamodbTables[tableName]?.table?.grantReadData(lambda);
            }
            if (permission === DynamodbPermission.INDEX) {
              if (dynamodbTables[tableName]?.policy) {
                lambda.addToRolePolicy(dynamodbTables[tableName]?.policy);
              }
            }
            if (permission === DynamodbPermission.WRITE) {
              dynamodbTables[tableName]?.table?.grantWriteData(lambda);
            }
            if (permission === DynamodbPermission.FULL) {
              dynamodbTables[tableName]?.table?.grantFullAccess(lambda);
            }
          });
        });
      }

      // Adding custom policies
      func.customPolicies?.map((policy: PolicyStatement) => {
        lambda.addToRolePolicy(policy);
      });

      // Put Lambda Function ARN to SSM Parameters Store
      if (func.ssm) {
        putParameter(scope, func.ssm, lambda.functionArn);
        result[func.ssm] = lambda;
      }

      // Add Lambda CloudWatch Log Group Metric Filter
      lambda.logGroup.addMetricFilter(`${func.functionName}Metric`, {
        metricNamespace: 'LambdaMetrics',
        metricName: `${func.functionName}MetricErrors`,
        filterPattern: {
          logPatternString: 'Internal Server Error'
        }
      });
    });
    return result;
  }
}
