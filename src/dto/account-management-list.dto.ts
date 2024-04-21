import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';
import { TABLE_SORT_DIRECTION } from 'src/constants';
import { IUserRole, Role } from 'src/interfaces/user';
import { Permission } from 'src/constants/user';

export interface IAccountManagement {
  paginatedResults?: IAccountManagementItem[];
  current?: number;
  limit?: number;
  page?: number;
  total?: number;
}

interface ILocationPlant {
  _id: string;
  name: string;
  status: string;
  tenant_id: string;
  type: unknown;
  path: unknown;
}
interface IPlantAccount {
  _id: string;
  name: string;
  tenant_id: string;
  status: unknown;
  locations: ILocationPlant[];
  path: unknown;
  type: unknown;
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
  user_role?: { role: IUserRole };
  user_manage_tenant: {
    tenant: {
      _id: string;
      name: string;
      status: unknown;
      plant: IPlantAccount;
    };
  }[];
  user_manage_plant: {
    plant: IPlantAccount;
  }[];
  user_manage_location: {
    location: ILocationPlant;
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

interface TenantParam {
  _id: string;
  plants: Array<{ _id: string; locations: Array<string> }>;
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
  tenants: TenantParam[];
}

export interface BodyUpdateAccountDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  role_id?: string;
  tenants?: TenantParam[];
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
export class GetPermissionDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_LIST_PERMISSION;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor() {
    super();
  }
}

export interface PermissionRole {
  _id: string;
  name: string;
  role: Role;
  groups: Array<{
    group_permission_id: string;
    permission: {
      _id: string;
      name: string;
      key: Permission;
    };
  }>;
}
export interface ResponsePermission {
  groups: Array<{ _id: string; name: string; key: Permission }>;
  roles: Array<PermissionRole>;
}

export interface IBodyUpdatePermission {
  roles: Array<{ id: string; groups: Array<string> }>;
}
export class UpdatePermissionDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: IBodyUpdatePermission;
  public url: string = ENDPOINT.UPDATE_LIST_PERMISSION;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IBodyUpdatePermission) {
    super();
    this.body = body;
  }
}

export enum exclude_roles {
  SUPER_ADMIN = '0',
  ANALYST = '3'
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
