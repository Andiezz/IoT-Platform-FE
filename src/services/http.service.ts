import i18n, { i18nKey } from 'src/locales/i18n';
import { message } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  PERMISSION_ROLE,
  USER_ACCESS_TOKEN,
  USER_REFRESH_TOKEN,
  USER_REMEMBER_ME
} from 'src/constants/app';
import { HTTP_STATUS_RESPONSE_KEY, ENDPOINT } from 'src/constants/api';
import { DTO, ResponseDTO } from 'src/dto/base.dto';
import { API_HOST } from 'src/environments/environment';
import eventEmitter from 'src/store/event';
import { messageResponse } from 'src/constants/message-response';
import { messageNotFoundUser } from 'src/constants/user';
import { PAGE_ROUTE } from 'src/constants/route';
import { makeAutoObservable, observable } from 'mobx';

export interface IHttpService {
  setToken(token?: string, refreshToken?: string): void;
  setSession(token?: string, refreshToken?: string): void;
  setRememberMe(isRememberMe: boolean): void;
  request<reqT extends DTO, resT>(dto: reqT): Promise<ResponseDTO<resT>>;
  uploadFile<resT>(
    url: string,
    form: FormData,
    singer: any
  ): Promise<ResponseDTO<resT>>;
  downloadFile(
    url: string,
    headers: object | undefined,
    meta: { name: string }
  ): Promise<void>;
  progress?: number;
  getToken(): string;
  dispose(): void;
  getRememberMe(): boolean;
  refreshToken(): Promise<string>;
}

export const cleanUpStorage = () => {
  localStorage.removeItem(USER_ACCESS_TOKEN);
  localStorage.removeItem(USER_REFRESH_TOKEN);
  sessionStorage.removeItem(USER_ACCESS_TOKEN);
  sessionStorage.removeItem(USER_REFRESH_TOKEN);
  localStorage.removeItem(USER_REMEMBER_ME);
  localStorage.removeItem(PERMISSION_ROLE);
  sessionStorage.removeItem(PERMISSION_ROLE);
};

export class HttpService implements IHttpService {
  private token: string | null;
  private refresh_token: string | null;
  private remember_me: boolean;
  progress?: number;
  refreshingFunc?: any;
  constructor() {
    this.refreshingFunc = undefined;
    this.remember_me =
      JSON.parse(localStorage.getItem(USER_REMEMBER_ME) as any)?.isRememberMe ??
      false;
    this.token = this.remember_me
      ? localStorage.getItem(USER_ACCESS_TOKEN)
      : sessionStorage.getItem(USER_ACCESS_TOKEN);
    this.refresh_token = this.remember_me
      ? localStorage.getItem(USER_REFRESH_TOKEN)
      : sessionStorage.getItem(USER_REFRESH_TOKEN);
    axios.defaults.baseURL = API_HOST + ENDPOINT.ROOT;
    axios.interceptors.response.use(this.onResponse, this.onResponseError);
    axios.defaults.validateStatus = (status: number) => status !== 401;
    makeAutoObservable(this, {
      progress: observable.ref
    });
  }

  private isUnauthorizedError(error: AxiosError) {
    return error.response?.status === 401;
  }

  private logicCheckDataResponse = (convertedResponse: {
    responseCode?: HTTP_STATUS_RESPONSE_KEY;
    message?: string;
  }) => {
    const isNotFound =
      convertedResponse?.responseCode === HTTP_STATUS_RESPONSE_KEY.NOT_FOUND;
    const isForbidden =
      convertedResponse?.responseCode === HTTP_STATUS_RESPONSE_KEY.FORBIDDEN;
    const isBadRequest =
      convertedResponse?.responseCode === HTTP_STATUS_RESPONSE_KEY.BAD_REQUEST;
    if (isNotFound) {
      if (convertedResponse.message === messageNotFoundUser) {
        message.error(i18n.t(`${i18nKey.validation.account.unfoundEmail}`));
      }
      if (
        convertedResponse.message === messageResponse.invalidEmailOrPassword
      ) {
        message.error(
          i18n.t(`${i18nKey.validation.emailOrPassword.invalidEmailOrPassword}`)
        );
      }
    }
    if (isForbidden) {
      eventEmitter.emit('forbidden');
      message.error(
        i18n.t(
          `${i18nKey.httpResponseMessage._401_Unauthorized_Access_Denided}`
        )
      );
    }
    if (isBadRequest) {
      const isLogout =
        convertedResponse.message ===
          messageResponse.inactiveAccountNotification &&
        ![`${PAGE_ROUTE.LOGIN}`, `${PAGE_ROUTE.FORGOT_PASSWORD}`].includes(
          window.location.pathname
        );
      if (
        convertedResponse.message === messageResponse.invalidEmailOrPassword
      ) {
        message.error(
          i18n.t(`${i18nKey.validation.emailOrPassword.invalidEmailOrPassword}`)
        );
      }
      if (isLogout) {
        eventEmitter.emit('logout');
        setTimeout(() => {
          cleanUpStorage();
          location.assign('/');
        });
      }
    }
  };

  private onResponse = (response: AxiosResponse): AxiosResponse => {
    const convertedResponse = response?.data;
    const isResponseSuccess =
      convertedResponse?.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS;
    if (!isResponseSuccess) {
      this.logicCheckDataResponse(convertedResponse);
    }
    return response;
  };

  private onResponseError = async (error: AxiosError): Promise<AxiosError> => {
    if (!this.token || !this.isUnauthorizedError(error)) {
      if (error.message === 'Network Error') {
        message.error(
          i18n.t(`${i18nKey.validation.common.networkConnectionError}`)
        );
      }

      if (error.message === 'Cancel Upload') {
        message.error('Cancel Upload');
      }
    }
    const originalConfig: any | undefined = error.config;
    try {
      //  that `refreshingFunc` is global, e.g. 2 expired requests will get the same function pointer and await same function.
      if (!this.refreshingFunc) this.refreshingFunc = this.refreshToken();

      await this.refreshingFunc;

      originalConfig.headers.Authorization = `Bearer ${this.token}`;

      // retry original request
      try {
        return await axios.request(originalConfig);
      } catch (innerError: any) {
        // if original req failed with 401 again - it means server returned not valid token for refresh request
        if (this.isUnauthorizedError(innerError)) {
          throw innerError;
        }
      }
    } catch (err) {
      cleanUpStorage();
      eventEmitter.emit('logout');
      setTimeout(() => {
        cleanUpStorage();
        location.assign('/');
      });
    } finally {
      this.refreshingFunc = undefined;
    }

    return Promise.reject(error);
  };

  public refreshToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .post(ENDPOINT.REFRESH_TOKEN, { token: this.refresh_token })
        .then((response) => {
          const newToken = response.data.data.accessToken;
          if (this.remember_me) {
            this.setToken(newToken, this.refresh_token);
          } else {
            this.setSession(newToken, this.refresh_token);
            this.setToken('', this.refresh_token);
          }
          resolve(newToken);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async request<reqT extends DTO, resT>(
    dto: reqT
  ): Promise<ResponseDTO<resT>> {
    try {
      const response = await axios({
        method: dto.method,
        headers: {
          Authorization: this.token ? 'Bearer ' + this.token : '',
          'X-Frame-Options': 'DENY',
          'Content-Security-Policy': "frame-ancestors 'self';",
          ...dto.headers
        },
        url: this.replaceURLToParamURL(dto.url, dto.param || {}),
        data: dto.body,
        params: dto.query,
        responseType: dto.responseType
      });
      const data = response.data || response.data.data;
      return { ...data };
    } catch (error: unknown) {
      return {
        data: undefined,
        responseCode: HTTP_STATUS_RESPONSE_KEY.UNKNOWN
      };
    }
  }

  public setToken(token: string, refreshToken?: string | null): void {
    if (this.remember_me) {
      this.token = token;
      this.refresh_token = refreshToken || '';
      localStorage.setItem(USER_ACCESS_TOKEN, token);
    }
    refreshToken
      ? localStorage.setItem(USER_REFRESH_TOKEN, refreshToken)
      : localStorage.setItem(USER_REFRESH_TOKEN, null as never);
  }

  public setSession(token: string, refreshToken?: string | null): void {
    this.token = token;
    this.refresh_token = refreshToken || '';
    sessionStorage.setItem(USER_ACCESS_TOKEN, token);
    refreshToken
      ? sessionStorage.setItem(USER_REFRESH_TOKEN, refreshToken)
      : sessionStorage.setItem(USER_REFRESH_TOKEN, null as never);
  }

  public setRememberMe(isRememberMe: boolean): void {
    this.remember_me = isRememberMe;
    localStorage.setItem(
      USER_REMEMBER_ME,
      JSON.stringify({ isRememberMe: isRememberMe })
    );
  }

  public async uploadFile<resT>(
    url: string,
    form: FormData,
    source: any
  ): Promise<ResponseDTO<resT>> {
    try {
      const response = await axios({
        method: 'POST',
        headers: {
          Authorization: this.token ? 'Bearer ' + this.token : '',
          'X-Frame-Options': 'DENY',
          'Content-Security-Policy': "frame-ancestors 'self';",
          'Content-Type': 'multipart/form-data'
        },
        url: url,
        responseType: 'json',
        data: form,
        cancelToken: source,
        onUploadProgress: (event) => {
          this.progress = event.progress;
        }
      });
      const data = response.data || response.data.data;
      return { ...data };
    } catch (error: unknown) {
      return {
        data: undefined,
        responseCode: HTTP_STATUS_RESPONSE_KEY.UNKNOWN
      };
    }
  }
  public async downloadFile(
    url: string,
    headers: object | undefined,
    meta: { name: string }
  ): Promise<void> {
    await axios({
      url: url,
      headers: {
        Authorization: this.token ? 'Bearer ' + this.token : '',
        ...headers
      },
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      const href = URL.createObjectURL(response.data);

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', meta.name);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }

  public getToken(): string {
    return this.token || '';
  }
  private replaceURLToParamURL = (url: string, param: object): string => {
    let newUrl = url;
    Object.entries(param).forEach(([key, value]) => {
      newUrl = newUrl.replace(':' + key.toString(), value.toString());
    });
    return newUrl;
  };

  public getRememberMe(): boolean{
    return this.remember_me
  }

  public dispose(): void {
    this.progress = 0;
  }
}

const httpClient = new HttpService();
export default httpClient;
