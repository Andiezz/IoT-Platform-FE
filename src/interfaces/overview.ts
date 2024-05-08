import { TypeFilterDate } from 'src/components/chart/line-bar-chart/line-bar-chart';
import { IDevice, ILocation, IThingItem } from 'src/dto/thing.dto';

export interface ITimeseriesData {
  'pm2.5'?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  lpg?: number;
  ch4?: number;
  co?: number;
  alcohol?: number;
  co2?: number;
  toluen?: number;
  nh4?: number;
  aceton?: number;
  tvoc?: number;
}

export interface IChart {
  'pm2.5'?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  lpg?: number;
  ch4?: number;
  co?: number;
  alcohol?: number;
  co2?: number;
  toluen?: number;
  nh4?: number;
  aceton?: number;
  tvoc?: number;
  chartType?: TypeFilterDate;
  _id?: string;
  time?: string;
}

export interface IStatistic {
  _id?: string;
  createdOn?: string;
  updatedOn?: string;
  locationsId?: string;
  name?: string;
  type?: string;
  status?: string;
  information?: number;
  isDeleted?: boolean;
  location?: ILocation;
  thing?: IThingItem;
  devices?: IDevice[];
  currentData: ITimeseriesData;
}

export interface IOverviewEms {
  location?: IThingItem;
  ems_statistic?: IStatistic;
  charts?: IChart[];
}

export interface IOverviewThing {
  thing: IThingItem;
  thingEnergyStatistics: ITimeseriesData;
  thingChart?: IChart[];
  lastUpdatedOn?: string;
  timeseries_data: ITimeseriesData;
  charts?: IChart[];
}
