import eventEmitter from 'src/store/event';
import { action, makeAutoObservable, observable, runInAction } from 'mobx';
import { LIMIT_RECORD } from 'src/constants';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { ResponseDTO } from 'src/dto/base.dto';
import {
  GetListNotificationDTO,
  IBodyUpdateNotify,
  INotification,
  IResponseUpdateNotification,
  ISocketMessage,
  ResponseNotification,
  UpdateNotificationDTO
} from 'src/dto/notification.dto';
import { IHttpService } from 'src/services/http.service';
import _ from 'lodash';

export interface INotificationStore {
  messages?: any[];
  pushMessage: (message: ISocketMessage) => void;
  listNotification: Array<INotification>;
  page: number;
  limit: number;
  total: number;
  totalUnread: number;
  isLoadingNotify: boolean;
  updateLoadingNotification(loadingNoifi: boolean): void;
  getListNotification(query: {
    page?: number;
    limit?: number;
  }): Promise<boolean>;
  loadMoreListNotification(query: {
    page?: number;
    limit?: number;
  }): Promise<boolean>;
  updateNotification(body: IBodyUpdateNotify): Promise<boolean>;
  destroyStoreWhenLogout(): void;
  onMessageNotification(message: ISocketMessage): void;
  onMessage(message: ISocketMessage): void;
}

export class NotificationStore implements INotificationStore {
  messages?: any[];
  isLoadingNotify: boolean;
  listNotification: Array<INotification> = [];
  page = 1;
  limit = LIMIT_RECORD;
  total = 0;
  totalUnread = 0;

  constructor(private http: IHttpService) {
    makeAutoObservable(this, {
      messages: observable,
      listNotification: observable,
      page: observable,
      limit: observable,
      total: observable,
      totalUnread: observable,
      isLoadingNotify: observable,
      pushMessage: action.bound,
      onMessage: action.bound
    });
    this.isLoadingNotify = false;
  }

  public pushMessage(message: ISocketMessage): void {
    if (this.messages) {
      const cloned = this.messages.slice();
      cloned.push(message);
      this.messages = cloned;
    } else {
      this.messages = [message];
    }
  }

  private actionSetListDataNotification(
    listNotification: Array<INotification>,
    total: number,
    totalUnread: number,
    page: number,
    limit: number
  ) {
    runInAction(() => {
      this.listNotification = listNotification;
      this.total = total;
      this.totalUnread = totalUnread;
      this.page = page;
      this.limit = limit;
    });
  }

  private async getDataNotification(query: {
    page?: number;
    limit?: number;
  }): Promise<
    ResponseDTO<ResponseNotification> & { data: ResponseNotification }
  > {
    const getListNotificationDto = new GetListNotificationDTO(query);
    return (await this.http.request(
      getListNotificationDto
    )) as ResponseDTO<ResponseNotification> & { data: ResponseNotification };
  }

  public async getListNotification(query: {
    page?: number;
    limit?: number;
  }): Promise<boolean> {
    const res = await this.getDataNotification(query);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      this.actionSetListDataNotification(
        res.data.paginatedResults,
        res.data.total,
        res.data.totalUnread || 0,
        res.data.page,
        res.data.limit
      );
      return true;
    }
    return false;
  }

  public async loadMoreListNotification(query: {
    page?: number;
    limit?: number;
  }): Promise<boolean> {
    const res = await this.getDataNotification(query);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      this.actionSetListDataNotification(
        _.unionBy(
          [...this.listNotification, ...res.data.paginatedResults],
          '_id'
        ),
        res.data.total,
        res.data.totalUnread,
        res.data.page,
        res.data.limit
      );
      return true;
    }
    return false;
  }

  public updateLoadingNotification(loadingNoifi: boolean) {
    runInAction(() => {
      this.isLoadingNotify = loadingNoifi;
    });
  }

  public async updateNotification(body: IBodyUpdateNotify): Promise<boolean> {
    const updateNotificationDto = new UpdateNotificationDTO(body);
    const res: ResponseDTO<IResponseUpdateNotification> =
      await this.http.request(updateNotificationDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.totalUnread = res.data?.totalUnread ?? 0;
        if (body.isUpdateAll) {
          this.listNotification = this.listNotification.map((item) => ({
            ...item
          }));
        } else {
          this.listNotification = this.listNotification.map((item) => {
            return (body.notificationIds || []).includes(item._id)
              ? { ...item }
              : item;
          });
        }
      });
      return true;
    }
    return false;
  }

  public onMessageNotification(message: ISocketMessage): void {
    runInAction(() => {
      this.page = this.page + 1;
      this.totalUnread = this.totalUnread + 1;
      this.listNotification = [message.data, ...this.listNotification];
    });
    eventEmitter.emit('notification', message);
  }

  public onMessage(message: ISocketMessage): void {
    console.log(message);
    if (message.channel === 'in-app-notification' && message.data) {
      runInAction(() => {
        this.page = this.page + 1;
        this.listNotification = [
          message.data,
          ...this.listNotification.slice(
            0,
            this.total >= LIMIT_RECORD ? -1 : this.listNotification.length
          )
        ];
        this.total < LIMIT_RECORD && ++this.total;
        this.totalUnread = this.totalUnread + 1;
        eventEmitter.emit('notification', message.data);
      });
    }
    this.pushMessage(message);
  }

  public destroyStoreWhenLogout(): void {
    runInAction(() => {
      this.messages = [];
      this.isLoadingNotify = false;
      this.page = 1;
      this.total = 0;
      this.totalUnread = 0;
      this.limit = LIMIT_RECORD;
      this.listNotification = [];
    });
  }
}
