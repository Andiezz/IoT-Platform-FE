import httpClient, { HttpService } from 'src/services/http.service';
import {
  AccountManagementListStore,
  IAccountListStore
} from './account-management/account-management-list.store';
import { IUserStore, UserStore } from './user.store';
import ConfigurationStore, { IConfiguration } from './configuration.store';
import {
  IThingListStore,
  IThingStore,
  ThingListStore,
  ThingStore
} from './thing.store';
import { IParameterStore, ParameterStore } from './parameter/parameter.store';
import {
  DeviceModelStore,
  IDeviceModelStore
} from './device-model/device-model.store';
import { IOverviewStore, OverviewStore } from './overview/overview.store';

export interface IRootStore {
  configuration: IConfiguration;
  userStore: IUserStore;
  httpClient: HttpService;
  listAccountManagementListStore: IAccountListStore;
  thingStore: IThingStore;
  listThingStore: IThingListStore;
  parameterStore: IParameterStore;
  deviceModelStore: IDeviceModelStore;
  overviewStore: IOverviewStore;
}
export type StoreChildKeyType = keyof IRootStore;

export class RootStore implements IRootStore {
  configuration: IConfiguration;
  userStore: IUserStore;
  httpClient: HttpService;
  listAccountManagementListStore: IAccountListStore;
  thingStore: IThingStore;
  listThingStore: IThingListStore;
  parameterStore: IParameterStore;
  deviceModelStore: IDeviceModelStore;
  overviewStore: IOverviewStore;
  constructor() {
    this.httpClient = httpClient;
    this.configuration = new ConfigurationStore();
    this.userStore = new UserStore();
    this.listAccountManagementListStore = new AccountManagementListStore(
      this.httpClient
    );
    this.thingStore = new ThingStore(this.httpClient);
    this.listThingStore = new ThingListStore(this.httpClient);
    this.parameterStore = new ParameterStore(this.httpClient);
    this.deviceModelStore = new DeviceModelStore(this.httpClient);
    this.overviewStore = new OverviewStore(this.httpClient);
  }
}

const rootStore = new RootStore();
export default rootStore;
