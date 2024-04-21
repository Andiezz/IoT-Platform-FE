import { ResponseType } from 'axios';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';

export interface IUpdatePasswordBody {
  newPassword: string;
  passwordConfirm: string;
}

export class AccountChangePasswordDTO extends DTO {
  public param: object | undefined;
  public query: undefined;
  public body: IUpdatePasswordBody;
  public url: string = ENDPOINT.CHANGE_ACCOUNT_PASSWORD;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseClass = String;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IUpdatePasswordBody) {
    super();
    this.body = body;
  }
}
