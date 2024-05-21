import { makeAutoObservable, observable, runInAction } from 'mobx';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { ResponseDTO } from 'src/dto/base.dto';
import { IOverviewFetch, OverviewThingDTO } from 'src/dto/overview.dto';
import { IChart, IOverviewThing } from 'src/interfaces/overview';
import { IHttpService } from 'src/services/http.service';

export interface IOverviewStore {
  fetchThing(param: { id: string }, request?: IOverviewFetch): Promise<void>;
  overviewThing?: IOverviewThing;
  listChart: IChart[];
  dispose(): void;
}

export class OverviewStore implements IOverviewStore {
  listChart: IChart[] = [];
  overviewThing?: IOverviewThing;
  statusOverview?: 'start' | 'stop';
  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      overviewThing: observable.ref,
      listChart: observable.ref,
      statusOverview: observable.ref
    });
  }

  public async fetchThing(
    param: { id: string },
    request?: IOverviewFetch
  ): Promise<void> {
    const overviewThingDto = new OverviewThingDTO(param, request);
    const res: ResponseDTO<IOverviewThing> = await this.http.request<
      OverviewThingDTO,
      IOverviewThing
    >(overviewThingDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.dispose();
        this.overviewThing = res.data;
      });
    } else {
      throw Error('fetch Thing failed');
    }
  }

  public dispose(): void {
    this.overviewThing = undefined;
    this.listChart = [];
  }
}
