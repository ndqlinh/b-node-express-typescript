import { sign, verify } from 'jsonwebtoken';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Account } from '../models/account.model';
import { StatusCodes } from '@common/enums/status-codes.enum';
import { Logger } from '@shared/helpers/logger.helper';

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
      return {
        code: StatusCodes.Unauthorized,
      }
    }

    verify(token, secretKey, (error, decoded) => {
      if (error) {
        Logger.INFO('Verify token error', error)
        return {
          code: StatusCodes.Forbidden
        }
      }

      Logger.INFO('Decoded', decoded);
      return decoded;
    });
  }
}
