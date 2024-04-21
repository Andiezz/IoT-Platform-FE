import { ResponseType } from 'axios';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';
import { ILoginForm, ILogoutForm } from 'src/interfaces/form/user';
import { USER_REFRESH_TOKEN } from 'src/constants/app';
import { Role } from 'src/interfaces/user';

export interface ILoginResponse {
  id: string;
  name: string;
  role: Role;
  token: string;
  email: string;
  tenant: string;
  refreshToken: string;
}

export class LogInDTO extends DTO {
  public param: object | undefined;
  public query: undefined;
  public body: ILoginForm;
  public url: string = ENDPOINT.LOGIN;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: ILoginForm) {
    super();
    this.body = body;
    this.headers = { Authorization: undefined };
  }
}

export class LogoutDTO extends DTO {
  public param: undefined;
  public query: undefined;
  public body: ILogoutForm;
  public url: string = ENDPOINT.LOGOUT;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor() {
    super();
    this.refresh_token = localStorage.getItem(USER_REFRESH_TOKEN);
    this.body = {
      token: this.refresh_token || ''
    };
  }
}
