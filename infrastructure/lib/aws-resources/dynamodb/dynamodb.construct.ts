import { BaseTableDefinition } from '@common/helpers/dynamodb.helpers';
import { GlobalSecondaryIndex } from '@common/types/dynamodb.type';
import { capitalizeFirstLetter } from '@common/utils/txt.util';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoContruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  createTables(scope: Construct, tables: BaseTableDefinition[]) {
    tables.map((table: BaseTableDefinition) => {
      const dTable = new Table(scope, `NodeExpress${table.name}`, {
        tableName: table.name,
        partitionKey: table.partitionKey,
        sortKey: table.sortKey,
        pointInTimeRecovery: table.pointInTimeRecovery,
        billingMode: table.billingMode,
        removalPolicy: table.removalPolicy
      });

      table.indexes?.map((index: GlobalSecondaryIndex) => {
        let indexName = `${index.partitionKey.name}Index`;
        if (index.sortKey) {
          indexName = `${index.sortKey.name}${capitalizeFirstLetter(indexName)}`;
        }
        dTable.addGlobalSecondaryIndex({
          indexName,
          ...index
        });
      });
    });
  }
}
