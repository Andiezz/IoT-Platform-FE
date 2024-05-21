import { ENDPOINT, HTTP_METHOD } from 'src/constants/api';
import { DTO } from './base.dto';
import { ResponseType } from 'axios';

export class GetListNotificationDTO extends DTO {
  public param: undefined;
  public query: { page?: number; limit?: number };
  public body: undefined;
  public url: string = ENDPOINT.GET_LIST_NOTIFICATION;
  public method: HTTP_METHOD = HTTP_METHOD.GET;
  public readonly responseType: ResponseType = 'json';
  constructor(query: { page?: number; limit?: number }) {
    super();
    this.query = query;
  }
}

export interface ISocketMessage {
  channel: string;
  data: INotification,
}

export interface IReceiver {
  userId: string;
  readAt: Date | null;
}

export interface INotification {
  _id: string;
  createdOn: Date;
  title: string;
  content: string;
  type: string;
  receivers: IReceiver[];
  readAt: Date | null;
}

export interface ResponseNotification {
  paginatedResults: Array<INotification>;
  page: number;
  limit: number;
  total: number;
  totalUnread: number;
}

export interface IBodyUpdateNotify {
  isUpdateAll: boolean;
  notificationIds?: Array<string>;
}

export interface IResponseUpdateNotification {
  notifications: Array<unknown>;
  totalCount: number;
  totalUnread: number;
}
export class UpdateNotificationDTO extends DTO {
  public param: undefined;
  public query: undefined;
  public body: IBodyUpdateNotify;
  public url: string = ENDPOINT.UPDATE_NOTIFICATION;
  public method: HTTP_METHOD = HTTP_METHOD.PUT;
  public readonly responseType: ResponseType = 'json';
  constructor(body: IBodyUpdateNotify) {
    super();
    this.body = body;
  }
}
