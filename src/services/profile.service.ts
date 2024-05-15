import { validateSchema } from '@shared/utils/validate.utils';
import { Profile, ProfileModel } from '../models/profile.model';
import { AccountRepository } from '../repositories/account.repository';
import { HttpException } from '@shared/helpers/exception.helper';
import { HTTPStatus } from '@shared/enums/http.enum';

export default class ProfileService {
  private readonly accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async findByEmail(email: string): Promise<Profile> {
    if (!email) {
      throw new HttpException(HTTPStatus.BAD_REQUEST, 'Missing profile email');
    }

    try {
      const profile = await this.accountRepository.findByEmail(email);
      delete profile.id;
      delete profile.password;
      return profile;
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Get profile detail failed', error);
    }
  }
}
