import { Account, AccountModel } from '../models/account.model';
import { AccountRepository } from './../repositories/account.repository';
import { AccountSchema } from '../validators/account.schema';
import { validateSchema } from '@shared/utils/validate.utils';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

export default class AccountService {
  private readonly accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async register(accountInput: Account): Promise<Account> {
    await validateSchema(AccountSchema, accountInput);

    try {
      const accountModel = new AccountModel(accountInput);
      const account = await this.accountRepository.save(accountModel);
      return account;
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Create provider has error', error);
    }
  }

  login(account: any): Promise<Account> {
    return;
  }
}
