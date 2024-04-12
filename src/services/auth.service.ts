import { sign, verify } from 'jsonwebtoken';
import SsmHelper from '@shared/helpers/ssm.helper';
import { Account } from '../models/account.model';

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

    try {
      return verify(token, secretKey);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}
