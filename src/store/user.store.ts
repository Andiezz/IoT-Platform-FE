import { action, makeAutoObservable, observable } from 'mobx';
import { IUserInfo } from 'src/interfaces/user';

export interface IUserStore {
  isLoggedIn: boolean;
  rememberLoginSession: boolean;
  userInfo?: IUserInfo;
  // changePassword(dto: IUpdatePasswordBody): Promise<boolean>;
  afterLogin(userInfo: IUserInfo, rememberMe: boolean): void;
  logout(): void;
  updateUserInfo(userInfo: IUserInfo): void;
}

export class UserStore implements IUserStore {
  isLoggedIn = false;
  rememberLoginSession = false;
  userInfo?: IUserInfo;

  constructor(){
    makeAutoObservable(this,
      {
        isLoggedIn: observable,
        userInfo: observable.ref,
        rememberLoginSession: observable,
        afterLogin: action.bound,
        logout: action.bound,
        updateUserInfo: action.bound
      }
      )
  }

  public afterLogin(userInfo: IUserInfo, rememberMe: boolean): void{
    this.userInfo = {
      ...userInfo
    };
    this.isLoggedIn = true;
    this.rememberLoginSession = !!rememberMe;
  }
  
  public updateUserInfo(userInfo: IUserInfo): void{
      this.userInfo = {...userInfo}
  }

  public logout(): void {
    this.isLoggedIn = false;
    this.rememberLoginSession = false;
    this.userInfo = undefined;
  }
}