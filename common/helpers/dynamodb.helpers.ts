import {
  BillingMode,
  GlobalSecondaryIndex,
  RemovalPolicy,
  TableDefinition,
  TableKey
} from '../types/dynamodb.type';

export class BaseTableDefinition implements TableDefinition {
  name: string;
  partitionKey: TableKey;
  sortKey?: TableKey;
  pointInTimeRecovery?: boolean;
  billingMode?: BillingMode;
  removalPolicy?: RemovalPolicy;
  indexes?: GlobalSecondaryIndex[] = [];

  constructor(data: TableDefinition) {
    this.name = `NodeExpress${data.name}Table`;
    this.partitionKey = data.partitionKey;
    this.sortKey = data.sortKey;
    this.pointInTimeRecovery = data.pointInTimeRecovery;
    this.billingMode = data.billingMode || BillingMode.PAY_PER_REQUEST;
    this.removalPolicy = data.removalPolicy || RemovalPolicy.RETAIN;
    this.indexes = data.indexes;
  }
}
