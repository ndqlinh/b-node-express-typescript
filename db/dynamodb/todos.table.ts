import { BaseTableDefinition } from '@common/helpers/dynamodb.helpers';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { TODOS_TABLE_NAME } from './tables';

export const todosTableDefinition = new BaseTableDefinition({
  name: TODOS_TABLE_NAME,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING
  },
  pointInTimeRecovery: true
});
