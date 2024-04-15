import { sign, verify } from 'jsonwebtoken';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Account } from '../models/account.model';
import { StatusCodes } from '@common/enums/status-codes.enum';
import { Logger } from '@shared/helpers/logger.helper';
import { BaseResponse } from '@shared/helpers/response.helper';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

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

    Logger.INFO('PARAM', secretKey);
    Logger.INFO('TOKEN', token);

    if (!token) {
      return new HttpException(HTTPStatus.UNAUTHORIZED, 'Unauthorized');
    }

    verify(token, secretKey, (error: any, decoded: any) => {
      if (error) {
        Logger.INFO('Verify token error', error.message);
        throw new HttpException(HTTPStatus.FORBIDDEN, error.message);
      }

      Logger.INFO('Decoded', decoded);
      return decoded;
    });
  }
}
