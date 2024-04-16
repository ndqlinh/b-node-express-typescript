import { sign, verify } from 'jsonwebtoken';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Account } from '../models/account.model';
import { Logger } from '@shared/helpers/logger.helper';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { BaseResponse } from '@shared/helpers/response.helper';

export default class AuthService {
  private readonly ssmHelper: SsmHelper;

  constructor() {
    this.ssmHelper = new SsmHelper();
  }

  async generateToken(account: Account, expiresIn: string): Promise<string> {
    const param = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    const secretKey = param?.NodeExpressTokenSecret;

    return sign({ id: account.id, email: account.email }, secretKey, { expiresIn });
  }

  async verifyToken(token: string): Promise<string | object> {
    const param = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    const secretKey = param?.NodeExpressTokenSecret;

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
}
