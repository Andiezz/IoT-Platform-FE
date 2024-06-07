import { makeAutoObservable, observable } from 'mobx';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { ResponseDTO } from 'src/dto/base.dto';
// import { TenantOverviewDTO } from 'src/dto/overview-tenant.dto';
// import {
//   ITenantListRequest,
//   ListTenantNoPermissionDTO
// } from 'src/dto/tenant-list.dto';
// import { IListTenantOverview, ITenantOverview } from 'src/interfaces/tenant-overview';
import { IHttpService } from 'src/services/http.service';

export interface ITenantOverviewStore {
  // tenantOverview?: ITenantOverview;
  // listTenantOverview: ITenantOverview[];
  // getTenantOverview(param: { id: string }): Promise<void>;
  // getAccount(request?: ITenantListRequest): Promise<ResponseDTO<IListTenantOverview>>;
  dispose(): void;
}
export class TenantOverviewStore implements ITenantOverviewStore {
  // tenantOverview?: ITenantOverview;
  // listTenantOverview: ITenantOverview[] = [];
  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      // tenantOverview: observable.ref
    });
  }

  // public async getTenantOverview(query: { id: string }) {
  //   const getTenantOverviewDTO = new TenantOverviewDTO(query);
  //   const res: ResponseDTO<ITenantOverview> = await this.http.request(
  //     getTenantOverviewDTO
  //   );
  //   if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
  //     this.dispose();
  //     this.tenantOverview = res.data;
  //   }
  // }

  // public async getAccount(request: ITenantListRequest) {
  //   const requestDTO = new ListTenantNoPermissionDTO(request);
  //   const res: ResponseDTO<IListTenantOverview> = await this.http.request(requestDTO);
  //   return res;
  // }

  public dispose(): void {
    // this.tenantOverview = undefined;
  }
}
