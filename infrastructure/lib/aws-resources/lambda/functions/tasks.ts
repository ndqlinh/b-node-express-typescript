import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { TODOS_TABLE_NAME } from '@db/dynamodb/tables';
import { DynamodbPermission } from '@common/types/dynamodb.type';

const lambdaOpions = {
  entry: 'tasks.controller.ts',
  auth: true,
  apiResourcePath: ROUTES.task,
  dynamodbTables: {
    [TODOS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  }
};

const taskCreateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TaskCreate',
  handler: 'createTask',
  ssm: 'TaskCreate',
  apiResourceMethod: 'POST'
});

const taskUpdateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TaskUpdate',
  handler: 'updateTask',
  ssm: 'TaskUpdate',
  apiResourceMethod: 'PUT'
});

const taskListFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TaskList',
  handler: 'getTasks',
  ssm: 'TaskList',
  apiResourceMethod: 'GET'
});

const taskFindFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TaskFind',
  handler: 'findTask',
  ssm: 'TaskFind',
  apiResourceMethod: 'GET',
  apiResourcePath: `${ROUTES.task}/{id}`
});

const taskDeleteFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TaskDelete',
  handler: 'deleteTask',
  ssm: 'TaskDelete',
  apiResourceMethod: 'DELETE',
  apiResourcePath: `${ROUTES.task}/{id}`
})

export const taskFunctions = [
  taskCreateFunction,
  taskUpdateFunction,
  taskListFunction,
  taskFindFunction,
  taskDeleteFunction
];
