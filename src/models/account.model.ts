import { Model } from './model';

export type Account = {
  id?: string;
  email: string;
  password: string;
  gender?: string,
  dob?: string,
  firstName?: string,
  lastName?: string,
  isSso?: boolean
}

export class AccountModel extends Model implements Account {
  email: string;
  password: string;
  gender?: string;
  dob?: string;
  firstName?: string;
  lastName?: string
  isSso?: boolean;

  constructor(account: Account) {
    super();

    this.email = account.email || '';
    this.password = account.password || '';
    this.gender = account.gender || '';
    this.dob = account.dob || '';
    this.firstName = account.firstName || '';
    this.lastName = account.lastName || '';
    this.isSso = account.isSso || false;
  }
}
