import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  private _user = {
    userType: UserType.Guest
  }
  constructor() { }


  get userType(): UserType {
    return this._user.userType;
  }
  set userType(value: UserType) {
    this._user.userType = value;
  }
}


export enum UserType {
  Guest = 1,
  User = 2,
  Manager = 4,
  Admin = 8
}
