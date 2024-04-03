import { LambdaFunction } from '../lambda.helper';
import { ROUTES } from '@config/routes';
import { TODOS_TABLE_NAME } from '@db/dynamodb/tables';
import { DynamodbPermission } from '@common/types/dynamodb.type';

const lambdaOpions = {
  entry: 'todos.controller.ts',
  auth: true,
  dynamodbTables: {
    [TODOS_TABLE_NAME]: [DynamodbPermission.FULL, DynamodbPermission.INDEX]
  }
};

const todoCreateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoCreate',
  handler: 'createTodo',
  ssm: 'TodoCreate',
  apiResourceMethod: 'POST',
  apiResourcePath: ROUTES.todos
});

const todoUpdateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoUpdate',
  handler: 'updateTodo',
  ssm: 'TodoUpdate',
  apiResourceMethod: 'PUT',
  apiResourcePath: ROUTES.todos
});

const todoListFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoList',
  handler: 'getTodos',
  ssm: 'TodoList',
  apiResourceMethod: 'GET',
  apiResourcePath: ROUTES.todos
});

const todoFindFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoFind',
  handler: 'findTodo',
  ssm: 'TodoFind',
  apiResourceMethod: 'GET',
  apiResourcePath: `${ROUTES.todos}/{id}`
});

export const todoFunctions = [
  todoCreateFunction,
  todoUpdateFunction,
  todoListFunction,
  todoFindFunction
];
