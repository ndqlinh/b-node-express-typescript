import { GetCommandInput, PutCommandInput, QueryCommandInput, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

export type PutItemCommandInputOptions = Omit<PutCommandInput, 'TableName' | 'Item'>;
export type GetItemCommandInputOptions = Omit<GetCommandInput, 'TableName' | 'Key'>;
export type DeleteCommandInputOptions = Omit<GetCommandInput, 'TableName' | 'Key'>;
export type QueryCommandInputOptions = Omit<QueryCommandInput, 'TableName'>;
export type ScanCommandInputOptions = Omit<ScanCommandInput, 'TableName'>;
