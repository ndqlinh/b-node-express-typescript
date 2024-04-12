import crypto from 'crypto';

import { Account, AccountModel } from '../models/account.model';
import { AccountRepository } from './../repositories/account.repository';
import { AccountSchema } from '../validators/account.schema';
import { validateSchema } from '@shared/utils/validate.utils';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';
import { Logger } from '@shared/helpers/logger.helper';
import SsmHelper from '@shared/helpers/ssm.helper';

export default class AccountService {
  private readonly accountRepository: AccountRepository;
  private readonly ssmHelper: SsmHelper;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.ssmHelper = new SsmHelper();
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

  login(account: any): Promise<Account> {
    return;
  }

  async hashPassword(password: string): Promise<string> {
    const param = await this.ssmHelper.getParams('NodeExpressTokenSecret');
    Logger.INFO('SSM Param', param);
    const hashedPassword = crypto.createHash('md5').update(`${password}-${param?.NodeExpressTokenSecret}`).digest('hex');
    return hashedPassword.toString();
  }

  async verify(account: any): Promise<Account> {
    try {
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
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Verify account failed', error);
    }
  }
}
