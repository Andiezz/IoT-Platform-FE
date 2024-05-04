import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';
import { TABLE_SORT_DIRECTION } from 'src/constants';
import { STATUS } from 'src/constants/status';
import { IUserBasic } from 'src/constants/user';

export interface ILocation {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
}

export interface ICertificate {
  certId: string;
  certArn: string;
}

export interface IManager {
  userId: string;
  isOwner: boolean;
  email: string;
  user?: IUserBasic;
}

export interface IThreshold {
  name: string;
  color: string;
  min: number;
  max: number;
}

export interface IParameterStandardModel {
  name: string;
  unit: string;
  weight: number;
  thresholds: IThreshold[];
}

export interface IDevice {
  name: string;
  status?: STATUS;
  model: string;
  parameterStandards: IParameterStandardModel[];
  parameterStandardDefault: boolean;
}

export interface IThing {
  paginatedResults?: IThingItem[];
  current?: number;
  limit?: number;
  page?: number;
  total?: number;
}

export interface IThingItem {
  _id?: string;
  createdOn?: string;
  updatedOn?: string;
  name: string;
  information: string;
  location: ILocation;
  status: STATUS;
  managers: IManager[];
  certificate: ICertificate;
  devices: IDevice[];
}

export interface IGetThingFile {
  file: {
    type: string;
    data: ArrayBufferLike;
  };
  name: string;
}

export interface IThingListRequest {
  q?: string;
  status?: string;
  sortOption?: {
    column?: string;
    sortDirection?: TABLE_SORT_DIRECTION;
  };
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface ResponseThingDTO {
  responseCode: string;
}

export class ListThingDTO extends DTO {
  public param: object | undefined;
  public query: IThingListRequest | undefined;
  public body: undefined;
  public url: string = ENDPOINT.THING_BASE_URL;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(request?: IThingListRequest) {
    super();
    this.query = request;
  }
}

export class DeleteThingDTO extends DTO {
  public param: { thingId: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.THING_PARAM_URL;
  public method: HTTP_METHOD = HTTP_METHOD.DELETE;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { thingId: string }) {
    super();
    this.param = param;
  }
}

export class GetThingDetailDTO extends DTO {
  public param: { id: string };
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.THING_PARAM_URL;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

//----------------DTO Create Thing----------------------//

export interface BodyCreateThingDTO {
  name: string;
  information?: string;
  location: ILocation;
  managers: IManager[];
  devices: IDevice[];
}

export class CreateThingDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.THING_BASE_URL;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyCreateThingDTO) {
    super();
    this.body = body;
  }
}

//-------Update Thing--------------//

export class UpdateThingtDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.THING_BASE_URL;
  public method: HTTP_METHOD = HTTP_METHOD.POST;
  public readonly responseType: ResponseType = 'json';
  constructor(body: BodyCreateThingDTO, param: { id: string }) {
    super();
    this.body = body;
    this.param = param;
  }
}

export class DownloadCertificateDTO extends DTO {
  public param: { id: string };
  public query: object | undefined;
  public body: undefined;
  public url: string = ENDPOINT.DOWNLOAD_CERTIFICATE;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType?: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

export class GetUserAssignManagerByEmailDTO extends DTO {
  public param: object | undefined;
  public query: object | undefined;
  public body: unknown | undefined;
  public url: string = ENDPOINT.GET_USER_ASSIGN_MANAGER_BY_EMAIL;
  public method: HTTP_METHOD = HTTP_METHOD.POST
  ;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IBodyGetUserAssignByEmail) {
    super();
    this.body = body;
  }
}

export interface IBodyGetUserAssignByEmail {
  email: string;
}

export interface IUserOwnerResponseGetByEmail {
  msg: string;
  user: IUserBasic;
}
