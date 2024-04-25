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
    const param = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    const secretKey = param?.NodeExpressTokenSecret;
    return secretKey;
  }

  async generateToken(account: Account, expiresIn: string): Promise<string> {
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
        if (error.name === 'TokenExpiredError') {
          throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Token has expired', error);
        } else {
          throw new HttpException(HTTPStatus.FORBIDDEN, error.message, error);
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

    const isValidToken = await this.verifyToken(refreshToken);

    if (!isValidToken) {
      throw new HttpException(HTTPStatus.UNAUTHORIZED, 'Invalid token');
    }

    const newAccessToken = await this.generateToken(account, '15m');
    const newRefreshToken = await this.generateToken(account, '1h');

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
