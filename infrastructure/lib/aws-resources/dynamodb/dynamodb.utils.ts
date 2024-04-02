import { Construct } from 'constructs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { dynamodbTables } from '@db/dynamodb';
import { BaseTableDefinition } from '@common/helpers/dynamodb.helpers';

export const getDynamodbTables = (scope: Construct) => {
  const tables: { [key: string]: { table: ITable; policy: PolicyStatement } } = {};
  dynamodbTables.map((table: BaseTableDefinition) => {
    const tb = Table.fromTableName(scope, `NodeExpress${table.name}`, table.name);
    tables[table.name] = {
      table: tb,
      policy: new PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [`${tb!.tableArn}/index/*`]
      })
    };
  });

  return tables;
}
