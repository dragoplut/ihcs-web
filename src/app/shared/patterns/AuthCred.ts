import { IAuthCred } from '../interfaces';

export default class AuthCred implements IAuthCred {
  public timeNow: string;
  public password: string;
  public username: string;
}
