import { BaseTableDefinition } from '@common/helpers/dynamodb.helpers';
import { AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { ACCOUNTS_TABLE_NAME } from './tables';

export const todosTableDefinition = new BaseTableDefinition({
  name: ACCOUNTS_TABLE_NAME,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING
  },
  indexes: [
    {
      partitionKey: {
        name: 'Email',
        type: AttributeType.STRING
      },
      projectionType: ProjectionType.ALL
    }
  ],
  pointInTimeRecovery: true
});
