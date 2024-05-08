import { makeAutoObservable, observable, runInAction } from 'mobx';
import { HTTP_STATUS_RESPONSE_KEY } from 'src/constants/api';
import { ResponseDTO } from 'src/dto/base.dto';
import {
  IOverviewFetch,
  OverviewCellDTO,
  OverviewCellDriverDTO,
  OverviewEmsDTO,
  OverviewPlantDTO
} from 'src/dto/overview.dto';
import {
  IStatistic,
  IOverviewEms,
  IOverviewCellDriver,
  IWeather,
  IChart,
  IOverviewCell,
  IOverviewPlant,
  IAlarmChartData,
  IChartPercent,
  IChartPlantKw
} from 'src/interfaces/overview';
import { IHttpService } from 'src/services/http.service';

export interface IOverviewStore {
  fetchEms(request?: IOverviewFetch): Promise<void>;
  fetchCellDriver(request?: IOverviewFetch): Promise<void>;
  fetchCellDriverChartData(request?: IOverviewFetch): Promise<void>;
  // fetchCell(request?: IOverviewFetch): Promise<void>;
  fetchPlant(request?: IOverviewFetch): Promise<void>;
  updateStatusOverViewEms(status: 'start' | 'stop'): void;
  overviewEms?: IStatistic;
  overviewPlant?: IOverviewPlant;
  overviewCellDriver?: IOverviewCellDriver;
  overviewCell?: IOverviewCell;
  weather?: IWeather;
  listChart: IChart[];
  dispose(): void;
  listChartAlarm?: IAlarmChartData[];
  listChartPercent: IChartPercent[];
  listChartPlantKwKwh: IChartPlantKw[];
}

export class OverviewStore implements IOverviewStore {
  overviewEms?: IStatistic;
  overviewCellDriver?: IOverviewCellDriver;
  overviewCell?: IOverviewCell;
  weather?: IWeather;
  listChart: IChart[] = [];
  listChartPercent: IChartPercent[] = [];
  listChartPlantKwKwh: IChartPlantKw[] = [];
  listChartAlarm?: IAlarmChartData[];
  overviewPlant?: IOverviewPlant;
  statusOverview?: 'start' | 'stop';
  constructor(private readonly http: IHttpService) {
    makeAutoObservable(this, {
      overviewEms: observable.ref,
      overviewCellDriver: observable.ref,
      overviewCell: observable.ref,
      overviewPlant: observable.ref,
      weather: observable.ref,
      listChart: observable.ref,
      listChartAlarm: observable.ref,
      statusOverview: observable.ref,
      listChartPercent: observable.ref
    });
  }
  public async fetchEms(request?: IOverviewFetch) {
    const overviewEmsDto = new OverviewEmsDTO(request);
    const res: ResponseDTO<IOverviewEms> = await this.http.request<
      OverviewEmsDTO,
      IOverviewEms
    >(overviewEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.dispose();
        this.listChartAlarm = res.data?.alarms_charts || [];
        this.overviewEms = res.data?.ems_statistic;
        this.weather = res.data?.weather;
        this.listChart = res.data?.charts as IChart[];
        this.statusOverview = res.data?.status;
      });
    }
  }

  public async fetchCellDriver(request?: IOverviewFetch) {
    const overviewEmsDto = new OverviewCellDriverDTO(request);
    const res: ResponseDTO<IOverviewCellDriver> = await this.http.request<
      OverviewCellDriverDTO,
      IOverviewCellDriver
    >(overviewEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.dispose();
        this.overviewCellDriver = res.data;
        this.listChart = res.data?.charts || [];
      });
    }
  }

  public async fetchCellDriverChartData(request?: IOverviewFetch) {
    const overviewEmsDto = new OverviewCellDriverDTO(request);
    const res: ResponseDTO<IOverviewCellDriver> = await this.http.request<
      OverviewCellDriverDTO,
      IOverviewCellDriver
    >(overviewEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.listChart = res.data?.charts || [];
      });
    }
  }

  public async fetchCell(request?: IOverviewFetch) {
    const overviewEmsDto = new OverviewCellDTO(request);
    const res: ResponseDTO<IOverviewCell> = await this.http.request<
      OverviewCellDTO,
      IOverviewCell
    >(overviewEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.dispose();
        this.overviewCell = res.data;
        this.listChart = res.data?.charts || [];
      });
    }
  }

  public async fetchPlant(request?: IOverviewFetch): Promise<void> {
    const overviewEmsDto = new OverviewPlantDTO(request);
    const res: ResponseDTO<IOverviewPlant> = await this.http.request<
      OverviewPlantDTO,
      IOverviewPlant
    >(overviewEmsDto);
    if (res.responseCode === HTTP_STATUS_RESPONSE_KEY.SUCCESS) {
      runInAction(() => {
        this.dispose();
        this.overviewPlant = res.data;
        this.listChartAlarm = res.data?.alarm_chart
        this.listChartPlantKwKwh = res.data?.chartkWh || [];
        this.listChartPercent = res.data?.chartPercent || []
      });
    }
    else{
      throw Error('fetch Plant failed')
    }

  }
  public updateStatusOverViewEms(status: 'stop' | 'start') {
    runInAction(() => {
      this.statusOverview = status;
    });
  }

  public dispose(): void {
    this.overviewEms = undefined;
    this.overviewPlant = undefined;
    this.overviewCellDriver = undefined;
    this.overviewCell = undefined;
    this.weather = undefined;
    this.listChart = [];
    this.listChartAlarm = [];
    this.listChartPercent =[];
    this.listChartPlantKwKwh = [];
  }
}
