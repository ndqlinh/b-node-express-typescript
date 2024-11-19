import { sign, verify } from 'jsonwebtoken';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Account } from '../models/account.model';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';

export default class AuthService {
  private readonly ssmHelper: SsmHelper;

  constructor() {
    this.ssmHelper = new SsmHelper();
  }

  private async getSecrets(): Promise<string> {
    const secretKey = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    return secretKey;
  }

  async generateToken(account: any, expiresIn: string): Promise<string> {
    const secretKey = await this.getSecrets();
    return sign({ id: account.id, email: account.email }, secretKey, { expiresIn });
  }

  async verifyToken(token: string): Promise<string | object> {
    const secretKey = await this.getSecrets();

    if (!token) {
      throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const result: any = verify(token, secretKey, (error: any, decoded: any) => {
      if (error) {
        Logger.INFO('Error', error);
        if (error.name === 'TokenExpiredError') {
          return new HttpException(HTTPStatus.UNAUTHORIZED, 'Token has expired', error);
        } else {
          return new HttpException(HTTPStatus.FORBIDDEN, error.message, error);
        }
      } else {
        return decoded;
      }
    });

    return result;
  }

  async renewToken(account: Account, refreshToken: string): Promise<any> {
    if (!refreshToken) {
      throw new HttpException(HTTPStatus.BAD_REQUEST, 'Missing token');
    }
    const newAccessToken = await this.generateToken(account, '1m');
    return newAccessToken
  }
}
