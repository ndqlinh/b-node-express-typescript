import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { appConfig } from '@config/index';
import {
  DeleteCommandInputOptions,
  GetItemCommandInputOptions,
  PutItemCommandInputOptions,
  QueryCommandInputOptions,
  ScanCommandInputOptions
} from '../types/dynamodb.type';

/*
 * See:
 * - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/
 * - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html
 */

export default class DynamoDBConnector {
  ddbDocClient: DynamoDBDocument;

  constructor() {
    const marshallOptions = {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: false, // false, by default.
      // Whether to remove undefined values while marshalling.
      removeUndefinedValues: true, // false, by default.
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: true // false, by default.
    };

    const unmarshallOptions = {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false // false, by default.
    };

    const translateConfig = { marshallOptions, unmarshallOptions };
    this.ddbDocClient = DynamoDBDocument.from(
      new DynamoDBClient({
        region: appConfig.dynamodb.region,
        endpoint: appConfig.dynamodb.endpoint
      }),
      translateConfig
    );
  }

  getTableName(tableName: string): string {
    if (process.env.ENVIRONMENT === 'local') {
      return tableName;
    }
    return `NodeExpress${tableName}Table`;
  }

  async put<T>(tableName: string, item: T, options?: PutItemCommandInputOptions): Promise<T> {
    const _response = await this.ddbDocClient.put({
      TableName: this.getTableName(tableName),
      Item: item,
      ...options
    });
    return item;
  }

  async get<T>(
    tableName: string,
    key: Record<string, any>,
    options?: GetItemCommandInputOptions
  ): Promise<T | undefined> {
    const response = await this.ddbDocClient.get({
      TableName: this.getTableName(tableName),
      Key: key,
      ...options
    });
    return response.Item && (response.Item as T);
  }

  async delete<T>(
    tableName: string,
    key: Record<string, any>,
    options?: DeleteCommandInputOptions
  ): Promise<Record<string, any>> {
    const _response = await this.ddbDocClient.delete({
      TableName: this.getTableName(tableName),
      Key: key,
      ...options
    });
    return key;
  }

  async query<T>(tableName: string, options: QueryCommandInputOptions): Promise<T[] | []> {
    const params = {
      TableName: this.getTableName(tableName),
      ...options
    };
    const response = await this.ddbDocClient.query(params);
    return (response.Items && (response.Items as T[])) || [];
  }

  async scan<T>(tableName: string, options?: ScanCommandInputOptions): Promise<T[] | []> {
    const params = {
      TableName: this.getTableName(tableName),
      ...options
    };
    const response = await this.ddbDocClient.scan(params);
    return (response.Items && (response.Items as T[])) || [];
  }
}
