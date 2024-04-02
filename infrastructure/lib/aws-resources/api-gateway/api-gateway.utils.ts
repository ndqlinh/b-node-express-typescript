import {
  AuthorizationType,
  MethodOptions,
  MethodResponse,
  TokenAuthorizer
} from 'aws-cdk-lib/aws-apigateway';
import { StatusCodes } from '@common/enums/status-codes.enum';

const responseParameters: any = {
  'method.response.header.Access-Control-Allow-Headers': true,
  'method.response.header.Access-Control-Allow-Methods': true,
  'method.response.header.Access-Control-Allow-Origin': true,
  'method.response.header.Cache-Control': true,
  'method.response.header.X-Frame-Options': true
};

const methodResponses: MethodResponse[] = [
  {
    statusCode: StatusCodes.Ok,
    responseParameters
  },
  {
    statusCode: StatusCodes.BadRequest,
    responseParameters
  },
  {
    statusCode: StatusCodes.Unauthorized,
    responseParameters
  },
  {
    statusCode: StatusCodes.Forbidden,
    responseParameters
  },
  {
    statusCode: StatusCodes.NotFound,
    responseParameters
  },
  {
    statusCode: StatusCodes.InternalServerError,
    responseParameters
  }
];

export const getMethodOptionsNoAuth = (): MethodOptions => {
  return {
    methodResponses: methodResponses
  };
};

export const getMethodOptionsWithAuth = (apiAuthorizer: TokenAuthorizer): MethodOptions => {
  return {
    methodResponses: methodResponses,
    authorizationType: AuthorizationType.CUSTOM,
    authorizer: apiAuthorizer
  };
};
