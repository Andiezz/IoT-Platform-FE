import { makeAutoObservable } from 'mobx';
import { IHttpService } from 'src/services/http.service';

export interface ITenantOverviewStore {
  dispose(): void;
}
export class TenantOverviewStore implements ITenantOverviewStore {
  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {});
  }

  public dispose(): void {}
}
