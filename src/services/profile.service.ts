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
      throw new HttpException(HTTPStatus.BAD_REQUEST, 'Missing email');
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

  async updateProfile(email: string, updateData: any): Promise<Profile> {
    if (!email) {
      throw new HttpException(HTTPStatus.BAD_REQUEST, 'Missing email');
    }

    try {
      const targetProfile = await this.accountRepository.findByEmail(email);
      if (targetProfile) {
        const updatedProfile = await this.accountRepository.save({ ...targetProfile, ...updateData });
        delete updatedProfile.id;
        delete updatedProfile.password;
        return updatedProfile;
      } else {
        throw new HttpException(HTTPStatus.NOT_FOUND, `Profile with email ${email} does not exist`);
      }
    } catch (error) {
      throw new HttpException(HTTPStatus.INTERNAL_SERVER_ERROR, 'Update profile failed', error);
    }
  }
}
