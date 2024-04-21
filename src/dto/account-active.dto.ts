import { ResponseType } from 'axios';
import { DTO } from './base.dto';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';

export interface IBodyActiveAccount {
    activation_code: string | null,
    new_password: string;
    confirm_new_password: string;
}
  export class ActiveAccountDTO extends DTO {
    public param: object | undefined;
    public query: undefined;
    public body: IBodyActiveAccount;
    public url: string = ENDPOINT.ACTIVE_ACCOUNT;
    public method: HTTP_METHOD = HTTP_METHOD.POST;
    public readonly responseType: ResponseType = 'json';
    constructor(body: IBodyActiveAccount) {
      super();
      this.body = body;
      this.headers = { Authorization: undefined};
    }
}