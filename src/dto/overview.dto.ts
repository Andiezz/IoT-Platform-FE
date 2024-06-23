import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';

export interface IOverviewFetch {
  from?: string;
  to?: string;
  type?: string;
  timezone?: string;
}

export class OverviewThingDTO extends DTO {
  public param: object | undefined;
  public query: IOverviewFetch | undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_OVERVIEW_THING;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }, request?: IOverviewFetch) {
    super();
    this.param = param;
    this.query = request;
  }
}

export class OverviewDailyDTO extends DTO {
  public param: object | undefined;
  public query: undefined;
  public body: undefined;
  public url: string = ENDPOINT.GET_OVERVIEW_DAILY;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(param: { id: string }) {
    super();
    this.param = param;
  }
}

