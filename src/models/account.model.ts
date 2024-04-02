export type Account = {
  id: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
}

export class AccountModel {
  id: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;

  constructor(account: Account) {
    this.id = account.id;
    this.email = account.email;
    this.password = account.password;
    this.accessToken = account.accessToken || '';
    this.refreshToken = account.refreshToken || '';
  }
}
