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
  apiResourcePath: ROUTES.todo
});

const todoUpdateFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoUpdate',
  handler: 'updateTodo',
  ssm: 'TodoUpdate',
  apiResourceMethod: 'PUT',
  apiResourcePath: ROUTES.todo
});

const todoListFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoList',
  handler: 'getTodos',
  ssm: 'TodoList',
  apiResourceMethod: 'GET',
  apiResourcePath: ROUTES.todo
});

const todoFindFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoFind',
  handler: 'findTodo',
  ssm: 'TodoFind',
  apiResourceMethod: 'GET',
  apiResourcePath: `${ROUTES.todo}/{id}`
});

const todoDeleteFunction = new LambdaFunction({
  ...lambdaOpions,
  functionName: 'TodoDelete',
  handler: 'deleteTodo',
  ssm: 'TodoDelete',
  apiResourceMethod: 'DELETE',
  apiResourcePath: ROUTES.todo
})

export const todoFunctions = [
  todoCreateFunction,
  todoUpdateFunction,
  todoListFunction,
  todoFindFunction,
  todoDeleteFunction
];
