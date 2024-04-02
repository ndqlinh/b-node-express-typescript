import { HttpMethods } from '@common/types/common.type';
import { LambdaFunction } from '../lambda/lambda.helpers';

export interface ApigatewayResourceProps {
  path: string;
  funcs: LambdaFunction[];
  allowOrigin?: string[];
  allowMethods?: HttpMethods[];
  allowHeaders?: string[];
}

export class ApigatewayResource implements ApigatewayResourceProps {
  path: string;
  funcs: LambdaFunction[];
  allowOrigin?: string[];
  allowMethods?: HttpMethods[];
  allowHeaders?: string[];

  constructor(data: ApigatewayResourceProps) {
    this.path = data.path;
    this.funcs = data.funcs;
    this.allowOrigin = data.allowOrigin || ['*'];
    this.allowMethods = data.allowMethods || ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE', 'PATCH'];
    this.allowHeaders = data.allowHeaders || ['Content-Type', 'Authorization'];
  }
}
