import { HTTPStatus } from '../enums/http.enum';

export class HttpException extends Error {
  statusCode: HTTPStatus;
  message: string;
  error?: any;

  constructor(statusCode: HTTPStatus, message: string, error?: any) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}
