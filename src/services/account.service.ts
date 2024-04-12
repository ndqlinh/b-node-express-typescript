import crypto from 'crypto';

import { Account, AccountModel } from '../models/account.model';
import { AccountRepository } from './../repositories/account.repository';
import { AccountSchema } from '../validators/account.schema';
import { validateSchema } from '@shared/utils/validate.utils';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import SsmHelper from '@shared/helpers/ssm.helper';
import AuthService from './auth.service';

export default class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly ssmHelper: SsmHelper;
  private readonly auth: AuthService;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.ssmHelper = new SsmHelper();
    this.auth = new AuthService();
  }

  async register(accountInput: Account): Promise<Account> {
    await validateSchema(AccountSchema, accountInput);

    try {
      const accountModel = new AccountModel(accountInput);
      accountModel.password = await this.hashPassword(accountModel.password);
      const account = await this.accountRepository.save(accountModel);
      return account;
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Register account failed', error);
    }
  }

  async login(account: Account): Promise<any> {
    const accessToken = await this.auth.generateToken(account, '15m');
    const refreshToken = await this.auth.generateToken(account, '1h');

    return {
      email: account.email,
      accessToken,
      refreshToken
    };
  }

  async hashPassword(password: string): Promise<string> {
    const param = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    const hashedPassword = crypto.createHash('md5').update(`${password}-${param?.NodeExpressTokenSecret}`).digest('hex');
    return hashedPassword.toString();
  }

  async verify(account: any): Promise<Account> {
    const tartgetAccount: Account = await this.accountRepository.findByEmail(account.email);

    if (!tartgetAccount) {
      throw new HttpException(HTTPStatus.NOT_FOUND, 'Account does not exist');
    } else {
      const hashedPassword = await this.hashPassword(account.password);
      const isMatchedPassword = hashedPassword === tartgetAccount.password;
      if (isMatchedPassword) {
        return tartgetAccount;
      } else {
        throw new HttpException(HTTPStatus.BAD_REQUEST, 'Invalid email or password');
      }
    }
  }
}
