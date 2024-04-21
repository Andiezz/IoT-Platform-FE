import httpClient, { HttpService } from 'src/services/http.service';
import {
  AccountManagementListStore,
  IAccountListStore
} from './account-management/account-management-list.store';
import { AlarmListStore, IAlarmListStore } from './alarm/alarm.store';
import {
  CommandLogsManagementListStore,
  ICommandLogsListStore
} from './command-logs/command-logs-managerment-list.store';
import ConfigurationStore, { IConfiguration } from './configuration.store';
import { EmsListStore, IEmsListStore } from './ems/ems.store';
import {
  INotificationStore,
  NotificationStore
} from './notification/notification.store';
import { IOverviewStore, OverviewStore } from './overview/overview.store';
import {
  ITenantOverviewStore,
  TenantOverviewStore
} from './overview/tenant/tenant-overview';
import {
  IPlantListStore,
  IPlantStore,
  PlantListStore,
  PlantStore
} from './plant/plant.store';
import { ITenantStore, TenantStore } from './tenant/tenant';
import { ITenantListStore, TenantListStore } from './tenant/tenant-list.store';
import {
  IUserActivityLogsListStore,
  UserActivityLogsListStore
} from './user-activity-logs/user-activity-logs.store';
import { IUserStore, UserStore } from './user.store';
import { CommandStore, ICommandStore } from './command/command.store';
import { IServiceStore, ServiceStore } from './service/service.store';
import eventEmitter from 'src/store/event';

export interface IRootStore {
  configuration: IConfiguration;
  userStore: IUserStore;
  listAccountManagementListStore: IAccountListStore;
  listTenantStore: ITenantListStore;
  httpClient: HttpService;
  tenantStore: ITenantStore;
  plantStore: IPlantStore;
  listPlantStore: IPlantListStore;
  notificationStore: INotificationStore;
  listEmsStore: IEmsListStore;
  commandLogsStore: ICommandLogsListStore;
  alarmStore: IAlarmListStore;
  userActivityLogsStore: IUserActivityLogsListStore;
  tenantOverviewStore: ITenantOverviewStore;
  overviewStore: IOverviewStore;
  commandStore: ICommandStore;
  serviceStore: IServiceStore;
}
export type StoreChildKeyType = keyof IRootStore;

export class RootStore implements IRootStore {
  configuration: IConfiguration;
  userStore: IUserStore;
  tenantStore: ITenantStore;
  listAccountManagementListStore: IAccountListStore;
  listTenantStore: ITenantListStore;
  plantStore: IPlantStore;
  listPlantStore: IPlantListStore;
  listEmsStore: IEmsListStore;
  httpClient: HttpService;
  notificationStore: INotificationStore;
  commandLogsStore: ICommandLogsListStore;
  alarmStore: IAlarmListStore;
  userActivityLogsStore: IUserActivityLogsListStore;
  tenantOverviewStore: ITenantOverviewStore;
  overviewStore: IOverviewStore;
  commandStore: ICommandStore;
  serviceStore: IServiceStore;
  constructor() {
    this.httpClient = httpClient;
    this.configuration = new ConfigurationStore();
    this.userStore = new UserStore();
    this.tenantStore = new TenantStore(this.httpClient);
    this.listAccountManagementListStore = new AccountManagementListStore(
      this.httpClient
    );
    this.listTenantStore = new TenantListStore(this.httpClient);
    this.plantStore = new PlantStore(this.httpClient);
    this.listPlantStore = new PlantListStore(this.httpClient);
    this.notificationStore = new NotificationStore(this.httpClient);
    this.listEmsStore = new EmsListStore(this.httpClient);
    this.commandLogsStore = new CommandLogsManagementListStore(this.httpClient);
    this.alarmStore = new AlarmListStore(this.httpClient);
    this.userActivityLogsStore = new UserActivityLogsListStore(this.httpClient);
    this.tenantOverviewStore = new TenantOverviewStore(this.httpClient);
    this.overviewStore = new OverviewStore(this.httpClient);
    this.commandStore = new CommandStore(this.httpClient);
    this.serviceStore = new ServiceStore(this.httpClient);


    eventEmitter.on('logout',()=>{
      this.listTenantStore.destroyStoreWhenLogout();
      this.notificationStore.destroyStoreWhenLogout();
    })
  }
}

const rootStore = new RootStore();
export default rootStore;
