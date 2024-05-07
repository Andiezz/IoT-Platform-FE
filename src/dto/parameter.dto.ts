import { TABLE_SORT_DIRECTION } from 'src/constants';
import { Role } from 'src/interfaces/user';
import { IParameterItem } from 'src/store/parameter/parameter.store';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';
import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';

export interface IParameter {
  paginatedResults?: IParameterItem[];
  current?: number;
  limit?: number;
  page?: number;
  total?: number;
}

export interface IParameterListRequest {
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

export class ListParameterDTO extends DTO {
  public param: object | undefined;
  public query: IParameterListRequest | undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_PARAMETER_LIST;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(request?: IParameterListRequest) {
    super();
    this.query = request;
  }
}

export class CreateParameterDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.CREATE_PARAMETER;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyCreateParameterDTO) {
    super();
    this.body = body;
  }
}

export class UpdateParameterDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.UPDATE_PARAMETER;
  public method: HTTP_METHOD = HTTP_METHOD.PUT;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyUpdateParameterDTO, param: { id: string }) {
    super();
    this.param = param;
    this.body = body;
  }
}

export class GetParameterDetailDTO extends DTO {
  public param: { id: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_PARAMETER_DETAIL;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

export class DeleteParameterDTO extends DTO {
  public param: { id: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.DELETE_PARAMETER;
  public method: HTTP_METHOD = HTTP_METHOD.DELETE;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

export interface ResponseParameterDTO {
  _id: string;
  name: string;
  unit: string;
  weight: number;
  thresholds: IThreshold[];
}

export interface BodyCreateParameterDTO {
  name: string;
  unit: string;
  weight: number;
  thresholds: IThreshold[];
}

export interface BodyUpdateParameterDTO {
  name: string;
  unit: string;
  weight: number;
  thresholds: IThreshold[];
}

export interface IThreshold {
  name: string;
  color: string;
  min: number;
  max: number;
}
