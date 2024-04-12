import { Model } from "./model";

export type Account = {
  id?: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  gender?: string,
  dob?: string,
  firstName?: string,
  lastName?: string
}

export class AccountModel extends Model implements Account {
  email: string;
  password: string;
  gender?: string;
  dob?: string;
  firstName?: string;
  lastName?: string
  accessToken: string;
  refreshToken: string;

  constructor(account: Account) {
    super();

    this.email = account.email || '';
    this.password = account.password || '';
    this.gender = account.gender || '';
    this.dob = account.dob || '';
    this.firstName = account.firstName || '';
    this.lastName = account.lastName || '';
    this.accessToken = account.accessToken || '' || '';
    this.refreshToken = account.refreshToken || '';
  }
}
