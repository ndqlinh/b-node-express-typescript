import { JwtPayload, verify } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

import { HTTPStatus } from '../enums/http.enum';
import { Tables } from '../enums/tables.enum';
import { HttpException } from '../helpers/exception.helper';

export const decodeToken = (authorizationToken: string): JwtPayload => {
  const token = authorizationToken.split(' ')[1];

  let decodedToken: JwtPayload;
  if (!token) {
    throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Token not found');
  }

  try {
    decodedToken = jwtDecode(token)
  } catch (error) {
    throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Can not decode token', error);
  }

  // if (decodedToken.aud !== SHOPIFY_CLIENT_ID) {
  //   throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Token is invalid', decodedToken);
  // }

  return decodedToken;
};

export const authorizer = async (authorizationToken: string) => {
  verify(authorizationToken, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Invalid token');
    }

    return decoded;
  });
};
