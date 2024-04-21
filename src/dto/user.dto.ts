import { ResponseType } from 'axios';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';

export enum MessageUpdateProfile {
    failed ='update-profile-fail',
    success = 'update-profile-success'

}
export interface UpdateProfileResponse {
    msg: MessageUpdateProfile
}
export class UpdateProfileDTO extends DTO {
    public param: object | undefined;
    public query: undefined;
    public body: FormData;
    public url: string = ENDPOINT.UPDATE_USER_PROFILE;
    public method: HTTP_METHOD = HTTP_METHOD.POST;
    public readonly responseType: ResponseType = 'json';
    constructor(body: FormData) {
      super();
      this.body = body;
    }

}
export class GetProfileDTO extends DTO {
    public param: object | undefined;
    public query: undefined;
    public body: undefined;
    public url: string = ENDPOINT.GET_USER_PROFILE;
    public method: HTTP_METHOD = HTTP_METHOD.GET;
    public readonly responseType: ResponseType = 'json';
    constructor() {
      super();
    }
}
