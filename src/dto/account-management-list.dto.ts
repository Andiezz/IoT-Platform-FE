import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';
import { TABLE_SORT_DIRECTION } from 'src/constants';
import { Role } from 'src/interfaces/user';

export interface IAccountManagement {
  paginatedResults?: IAccountManagementItem[];
  current?: number;
  limit?: number;
  page?: number;
  total?: number;
}

export interface IAccountManagementItem {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_code?: number;
  phone_number?: number;
  is_active?: boolean;
  avatar?: string;
  is_first_login?: boolean;
  is_expired_activation_code?: boolean;
  user_manage?: [];
  user_manage_tenant: {
    tenant: {
      _id: string;
      name: string;
      status: unknown;
    };
  }[];
}

export interface IAccountManagementListRequest {
  q?: string;
  role_id?: string;
  is_active?: boolean;
  sortOption?: {
    column?: string;
    sortDirection?: TABLE_SORT_DIRECTION;
  };
  sort_by?: string;
  sort_order?: TABLE_SORT_DIRECTION;
  page?: number;
  pageSize?: number;
  limit?: number;
  role?: Role;
}

export interface IAccountParam {
  accountId?: string;
}

export class ListAccountManagementDTO extends DTO {
  public param: object | undefined;
  public query: IAccountManagementListRequest | undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_ACCOUNT_LIST;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(request?: IAccountManagementListRequest) {
    super();
    this.query = request;
  }
}

export interface ResponseAccountDTO {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}
export interface ResponseActiveLinkDTO {
  email: string;
}
export interface BodyCreateAccountDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  role_id: string;
}

export interface BodyUpdateAccountDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  role_id?: string;
  is_active: boolean;
}

export class UpdateAccountDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.UPDATE_ACCOUNT;
  public method: HTTP_METHOD = HTTP_METHOD.PUT;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyUpdateAccountDTO, param: { id: string }) {
    super();
    this.param = param;
    this.body = body;
  }
}
export class CreateAccountDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.CREATE_ACCOUNT;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyCreateAccountDTO) {
    super();
    this.body = body;
  }
}

export class GetRoleDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_LIST_ROLE;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor() {
    super();
  }
}

export class GetAccountDetailDTO extends DTO {
  public param: { id: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_ACCOUNT_DETAIL;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

export class GetListUserAssignDTO extends DTO {
  public param: object | undefined;
  public query: IAccountManagementListRequest & { exclude_roles?: string };
  public body: undefined;
  public url: string = ENDPOINT.GET_LIST_USER_ASSIGN;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(
    query: IAccountManagementListRequest & { exclude_roles?: string }
  ) {
    super();
    this.query = query;
  }
}

export class GetNewLinkActiveAccount extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.GET_NEW_LINK_ACTIVE_ACCOUNT;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: ResponseActiveLinkDTO) {
    super();
    this.body = body;
  }
}

export interface IBodyGetUserAssignByEmail {
  email: string;
}
export class GetUserAssignByEmailDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.GET_USER_ASSIGN_BY_EMAIL;
  public method: HTTP_METHOD = HTTP_METHOD.POST
  ;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IBodyGetUserAssignByEmail) {
    super();
    this.body = body;
  }
}
