import { IHttpService } from './http.service';
import {
  ILoginResponse,
  LogInDTO,
  LogoutDTO
} from 'src/dto/authentication.dto';
import { ResponseDTO } from 'src/dto/base.dto';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { action, makeObservable, observable, runInAction } from 'mobx';
import {
  PERMISSION_ROLE,
  USER_ACCESS_TOKEN,
  USER_REFRESH_TOKEN,
  USER_REMEMBER_ME
} from 'src/constants/app';
import { ForgotPasswordDTO } from 'src/dto/forgot-password.dto';
import eventEmitter from 'src/store/event';
import { PermissionRole } from 'src/dto/account-management-list.dto';
import {
  ChangeForgotPasswordDTO,
  IChangePasswordBody
} from 'src/dto/change-password.dto';
import {
  ActiveAccountDTO,
  IBodyActiveAccount
} from 'src/dto/account-active.dto';

export interface IAuthenticationService {
  isAuthenticated: boolean;
  otpToken?: string | null;
  permissionRole: PermissionRole | null;
  login(form: LogInDTO): Promise<ResponseDTO<ILoginResponse>>;
  logout(): Promise<boolean>;
  forgotPassword(values: ForgotPasswordDTO): Promise<boolean | string>;
  changeForgotPassword(values: IChangePasswordBody): Promise<ResponseDTO<any>>;
  activeAccount(body: IBodyActiveAccount): Promise<ResponseDTO<any>>;
  setPermissionRole(permissionRole: PermissionRole | null,isRememberMe: boolean): void;
}

export class AuthenticationService implements IAuthenticationService {
  @observable
  isAuthenticated = false;
  @observable
  otpToken?: string | null = null;
  @observable
  permissionRole: PermissionRole | null = null;
  constructor(private readonly httpService: IHttpService) {
    const localToken =
      localStorage.getItem(USER_ACCESS_TOKEN) ||
      sessionStorage.getItem(USER_ACCESS_TOKEN);
    this.permissionRole = JSON.parse(
      sessionStorage.getItem(PERMISSION_ROLE) ||
        localStorage.getItem(PERMISSION_ROLE) ||
        'null'
    );
    this.isAuthenticated = !!localToken;
    makeObservable(this);
  }

  @action.bound
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
  
  setPermissionRole(permissionRole: PermissionRole | null,isRememberMe: boolean) {
    runInAction(() => {
      this.permissionRole = permissionRole;
      if (isRememberMe) {
        localStorage.setItem(PERMISSION_ROLE, JSON.stringify(permissionRole));        
      } else {
        sessionStorage.setItem(PERMISSION_ROLE, JSON.stringify(permissionRole));
      }
    });
  }
  public async login(form: LogInDTO): Promise<ResponseDTO<ILoginResponse>> {
    const result: ResponseDTO<ILoginResponse> = await this.httpService.request<
      LogInDTO,
      ILoginResponse
    >(form);
    if (
      result.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS &&
      result.data
    ) {
      runInAction(() => {
        this.isAuthenticated = true;
        const { token, role } = result?.data || {};
        this.otpToken = token;
        this.permissionRole = role || null;
      });

      if (form.body.rememberMe) {
        this.httpService.setRememberMe(true);
        this.httpService.setToken(result.data.token, result.data.refreshToken);
        this.setPermissionRole(result.data.role || null, true)
      } else {
        this.httpService.setRememberMe(false);
        this.httpService.setSession(
          result.data.token,
          result.data.refreshToken
        );
        this.httpService.setToken('', result.data.refreshToken);
        this.setPermissionRole(result.data.role || null, false)
      }
    }
    return result;
  }

  public async logout(): Promise<boolean> {
    const dto = new LogoutDTO();
    const result: ResponseDTO<boolean> = await this.httpService.request(dto);
    eventEmitter.emit('logout');
    this.httpService.setToken(undefined, undefined);
    this.httpService.setSession(undefined, undefined);
    runInAction(() => {
      this.isAuthenticated = false;
      localStorage.removeItem(USER_REMEMBER_ME);
      localStorage.removeItem(USER_ACCESS_TOKEN);
      localStorage.removeItem(USER_REFRESH_TOKEN);
      sessionStorage.removeItem(USER_ACCESS_TOKEN);
      sessionStorage.removeItem(USER_REFRESH_TOKEN);
      localStorage.removeItem(PERMISSION_ROLE);
      sessionStorage.removeItem(PERMISSION_ROLE);
    });
    return !!result.data;
  }

  public async forgotPassword(
    values: ForgotPasswordDTO
  ): Promise<boolean | string> {
    const result: ResponseDTO<String> = await this.httpService.request<
      ForgotPasswordDTO,
      string
    >(values);
    if (result.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      return true;
    }
    return result.message || '';
  }

  public async changeForgotPassword(
    values: IChangePasswordBody
  ): Promise<ResponseDTO<any>> {
    const changeForgotPasswordDTO = new ChangeForgotPasswordDTO(values);
    const result: ResponseDTO<ILoginResponse> = await this.httpService.request<
      ChangeForgotPasswordDTO,
      ILoginResponse
    >(changeForgotPasswordDTO);
    return result;
  }

  public async activeAccount(
    body: IBodyActiveAccount
  ): Promise<ResponseDTO<any>> {
    const activeAccountDTO = new ActiveAccountDTO(body);
    const res: ResponseDTO<any> = await this.httpService.request(
      activeAccountDTO
    );
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.isAuthenticated = false;
        localStorage.clear();
      });
    }
    return res;
  }
}
