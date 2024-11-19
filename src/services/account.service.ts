import crypto from 'crypto';

import { Account, AccountModel } from '../models/account.model';
import { AccountRepository } from './../repositories/account.repository';
import { AccountSchema } from '../validators/account.schema';
import { validateSchema } from '@shared/utils/validate.utils';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import SsmHelper from '@shared/helpers/ssm.helper';
import AuthService from './auth.service';
import { Logger } from '@shared/helpers/logger.helper';

export default class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly ssmHelper: SsmHelper;
  private readonly auth: AuthService;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.ssmHelper = new SsmHelper();
    this.auth = new AuthService();
  }

  async register(accountInput: Account): Promise<Account | any> {
    await validateSchema(AccountSchema, accountInput);

    try {
      const accountModel = new AccountModel(accountInput);
      const existedEmail = await this.accountRepository.findByEmail(accountModel.email);
      if (existedEmail) {
        return {
          code: HTTPStatus.BAD_REQUEST,
          message: `Email ${accountModel.email} already exists`
        }
      } else {
        accountModel.password = await this.hashPassword(accountModel.password);
        const account = await this.accountRepository.save(accountModel);
        return {
          code: HTTPStatus.OK,
          data: account
        }
      }
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Register account failed', error);
    }
  }

  async login(account: any): Promise<any> {
    const accessToken = await this.auth.generateToken(account, '24h');
    const refreshToken = await this.auth.generateToken(account, '15m');

    return {
      code: HTTPStatus.OK,
      data: {
        email: account.email,
        accessToken,
        refreshToken
      }
    };
  }

  async hashPassword(password: string): Promise<string> {
    const param = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    const hashedPassword = crypto.createHash('md5').update(`${password}-${param?.NodeExpressTokenSecret}`).digest('hex');
    return hashedPassword.toString();
  }

  async verify(account: any): Promise<Account | any> {
    const tartgetAccount: Account = await this.accountRepository.findByEmail(account.email);

    if (!tartgetAccount) {
      return {
        code: HTTPStatus.NOT_FOUND,
        message: 'Account does not exist'
      }
    } else {
      const hashedPassword = await this.hashPassword(account.password);
      const isMatchedPassword = hashedPassword === tartgetAccount.password;
      Logger.INFO('isMatchedPassword', isMatchedPassword);
      if (isMatchedPassword) {
        return tartgetAccount;
      } else {
        return {
          code: HTTPStatus.BAD_REQUEST,
          message: 'Invalid email or password'
        }
      }
    }
  }
}
