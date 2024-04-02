import { HTTPStatus } from '../enums/http.enum';
import { HttpException } from './exception.helper';

export interface BaseResponse {
  code: HTTPStatus;
  data?: any;
  error?: any;
}

export class BaseResponse implements BaseResponse {
  format = () => {
    return {
      statusCode: this.code,
      body: JSON.stringify({
        code: this.code,
        data: this.data,
        error: this.error
      })
    };
  };

  static toSuccess = (data: any) => {
    const response = new BaseResponse();
    response.code = HTTPStatus.OK;
    response.data = data;
    return response.format();
  };

  static toError = (error: Error | HttpException | any) => {
    const errorResponse = new BaseResponse();
    errorResponse.code = error instanceof HttpException ? error.code : HTTPStatus.INTERNAL_SERVER_ERROR;
    errorResponse.error = error instanceof HttpException ? error.errorMsg : 'Internal Server Error';
    return errorResponse.format();
  };

  static toProxy = (url: string) => {
    return {
      statusCode: HTTPStatus.FOUND,
      headers: {
        Location: url
      }
    };
  };
}
