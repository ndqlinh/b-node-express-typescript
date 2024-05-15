import { Model } from './model';

export type Profile = {
  id?: string;
  email: string;
  gender?: string,
  dob?: string,
  firstName?: string,
  lastName?: string
}

export class ProfileModel extends Model implements Profile {
  email: string;
  gender?: string;
  dob?: string;
  firstName?: string;
  lastName?: string

  constructor(account: Profile) {
    super();

    this.email = account.email || '';
    this.gender = account.gender || '';
    this.dob = account.dob || '';
    this.firstName = account.firstName || '';
    this.lastName = account.lastName || '';
  }
}
