import Joi from 'joi';
import { HTTPStatus } from '../enums/http.enum';
import { HttpException } from '../helpers/exception.helper';
import { Logger } from '../helpers/logger.helper';

export const validateSchema = async (
  joiSchema: Joi.Schema<any | any[]>,
  value: any,
  options?: Joi.AsyncValidationOptions
) => {
  try {
    await joiSchema.validateAsync(value, {
      abortEarly: false,
      ...options
    });
  } catch (error: Joi.ValidationError | any) {
    Logger.ERROR('Validate schema error', error);
    if (error.isJoi) {
      const errors = error.details.map((detail: Joi.ValidationErrorItem) => detail.message);
      throw new HttpException(HTTPStatus.BAD_REQUEST, errors);
    }
    throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Can not validate data input', error);
  }
};
