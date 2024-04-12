import { AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';

import { BaseTableDefinition } from '@common/helpers/dynamodb.helpers';
import { ACCOUNTS_TABLE_NAME } from './tables';

export const accountsTableDefinition = new BaseTableDefinition({
  name: ACCOUNTS_TABLE_NAME,
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING
  },
  pointInTimeRecovery: true
});
