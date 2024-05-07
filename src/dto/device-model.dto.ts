import { TABLE_SORT_DIRECTION } from 'src/constants';
import { Role } from 'src/interfaces/user';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { IDeviceModelItem } from 'src/store/device-model/device-model.store';
import { IParameterItem } from 'src/store/parameter/parameter.store';

export interface IDeviceModel {
  paginatedResults?: IDeviceModelItem[];
  current?: number;
  limit?: number;
  page?: number;
  total?: number;
}

export interface IDeviceModelListRequest {
  q?: string;
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

export class ListDeviceModelDTO extends DTO {
  public param: object | undefined;
  public query: IDeviceModelListRequest | undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_DEvICE_MODEL_LIST;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(request?: IDeviceModelListRequest) {
    super();
    this.query = request;
  }
}

export class CreateDeviceModelDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.CREATE_DEVICE_MODEL;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyCreateDeviceModelDTO) {
    super();
    this.body = body;
  }
}

export class UpdateDeviceModelDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.UPDATE_DEVICE_MODEL;
  public method: HTTP_METHOD = HTTP_METHOD.PUT;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyUpdateDeviceModelDTO, param: { id: string }) {
    super();
    this.param = param;
    this.body = body;
  }
}

export class GetDeviceModelDetailDTO extends DTO {
  public param: { id: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_DEVICE_MODEL_DETAIL;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

export class DeleteDeviceModelDTO extends DTO {
  public param: { id: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.DELETE_DEVICE_MODEL;
  public method: HTTP_METHOD = HTTP_METHOD.DELETE;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

export interface ResponseDeviceModelDTO {
  _id: string;
  name: string;
  information: string;
  type: string;
  parameterStandards: IParameterItem[];
}

export interface BodyCreateDeviceModelDTO {
  name: string;
  information: string;
  type: string;
  parameterStandards: string[];
}

export interface BodyUpdateDeviceModelDTO {
  name: string;
  information: string;
  type: string;
  parameterStandards: string[];
}
