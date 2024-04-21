import { ResponseType } from 'axios';
import { DTO } from './base.dto';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';

export interface IForgotPasswordBody {
  email: string;
}

export class ForgotPasswordDTO extends DTO {
  public param: object | undefined;
  public query: undefined;
  public body: IForgotPasswordBody;
  public url: string = ENDPOINT.FORGOT_PASSWORD;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IForgotPasswordBody) {
    super();
    this.body = body;
    this.headers = { Authorization: undefined };
  }
}