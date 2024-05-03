import httpClient, { HttpService } from 'src/services/http.service';
import {
  AccountManagementListStore,
  IAccountListStore
} from './account-management/account-management-list.store';
import { IUserStore, UserStore } from './user.store';
import ConfigurationStore, { IConfiguration } from './configuration.store';
import { IThingListStore, IThingStore, ThingListStore, ThingStore } from './thing.store';

export interface IRootStore {
  configuration: IConfiguration;
  userStore: IUserStore;
  httpClient: HttpService;
  listAccountManagementListStore: IAccountListStore;
  thingStore: IThingStore;
  listThingStore: IThingListStore;
}
export type StoreChildKeyType = keyof IRootStore;

export class RootStore implements IRootStore {
  configuration: IConfiguration;
  userStore: IUserStore;
  httpClient: HttpService;
  listAccountManagementListStore: IAccountListStore;
  thingStore: IThingStore;
  listThingStore: IThingListStore;
  constructor() {
    this.httpClient = httpClient;
    this.configuration = new ConfigurationStore();
    this.userStore = new UserStore();
    this.listAccountManagementListStore = new AccountManagementListStore(
      this.httpClient
    );
    this.thingStore = new ThingStore(this.httpClient);
    this.listThingStore = new ThingListStore(this.httpClient);
  }
}

const rootStore = new RootStore();
export default rootStore;
