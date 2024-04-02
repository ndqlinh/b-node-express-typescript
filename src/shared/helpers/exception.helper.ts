import { HTTPStatus } from '../enums/http.enum';

export class HttpException extends Error {
  code: HTTPStatus;
  errorMsg: string;
  internalError?: any;

  constructor(code: HTTPStatus, errorMsg: string, internalError?: any) {
    super();
    this.code = code;
    this.errorMsg = errorMsg;
    this.internalError = internalError;
  }
}
