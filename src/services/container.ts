import {
  AuthenticationService,
  IAuthenticationService
} from './authentication.service';
import httpService, { IHttpService } from './http.service';
import { IUserService, UserService } from './user.service';
import { IClientService, ClientService } from './websocket/client.service';

export interface IServiceContainer {
  httpService: IHttpService;
  authenticationService: IAuthenticationService;
  userService: IUserService;
  socketService: IClientService;
}
export type IoCServiceKeyType = keyof IServiceContainer;
export class ServiceContainer implements IServiceContainer {
  httpService: IHttpService;
  authenticationService: IAuthenticationService;
  userService: IUserService;
  socketService: IClientService;
  constructor() {
    this.httpService = httpService;
    this.authenticationService = new AuthenticationService(this.httpService);
    this.userService = new UserService(this.httpService,this.authenticationService);
    this.socketService = new ClientService(this.httpService);
  }
}

const ioc = new ServiceContainer();
export default ioc;
