import { sign, verify } from 'jsonwebtoken';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Account } from '../models/account.model';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

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
      return new HttpException(HTTPStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const result: any = verify(token, secretKey, (error: any, decoded: any) => {
      if (error) {
        return new HttpException(HTTPStatus.FORBIDDEN, error.message);
      }
      return decoded;
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

    const newAccessToken = this.generateToken(account, '15m');
    const newRefreshToken = this.generateToken(account, '1h');

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
