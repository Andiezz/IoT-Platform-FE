import { ResponseType } from 'axios';
import { DTO } from './base.dto';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';

export interface IChangePasswordBody {
  token: string | null;
  newPassword: string;
  confirmPassword: string;
}

export class ChangeForgotPasswordDTO extends DTO {
  public param: object | undefined;
  public query: undefined;
  public body: IChangePasswordBody;
  public url: string = ENDPOINT.CHANGE_PASSWORD;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IChangePasswordBody) {
    super();
    this.body = body;
    this.headers = { Authorization: undefined };
  }
}
