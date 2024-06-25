import { TypeFilterDate } from 'src/components/line-bar-chart/line-bar-chart';
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

export interface IParameterThreshold {
  name: string;
  min: number;
  max: number;
}

export interface IEvaluatedParameter {
  name: string;
  value: number;
  unit: string;
  weight: number;
  threshold: {
    name: string;
    color: string;
    min: number;
    max: number;
  };
  type: string;
  iaqiValue?: number;
}

export interface IGeneralIaqiReport {
  generalIaqi: number;
  color: string;
  name: string;
}
export interface IAQResult {
  generalIaqiReport: IGeneralIaqiReport;
  acceptableSubstances: IEvaluatedParameter[];
  unAcceptableSubstances: IEvaluatedParameter[];
}

export interface IQualityReport {
  iaqResult: IAQResult;
  timeseriesData: ITimeseriesData[];
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

export interface IOverviewThing {
  thingDetail: IThingItem;
  timeseriesData?: IChart[];
  thingWarning?: any;
  qualityReport?: IQualityReport;
}

export interface IOverviewDaily {
  pm25?: number;
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

export interface IChartTemperature {
  temperature: number;
  chart_type: string;
  time: string;
}

export interface IChartHumidity {
  humidity: number;
  chart_type: string;
  time: string;
}

export interface IChartParticulateMatter {
  'pm2.5': number;
  pm10: number;
  chart_type: string;
  time: string;
}

export interface IChartToxicGases {
  lpg: number;
  co: number;
  co2: number;
  tvoc: number;
  chart_type: string;
  time: string;
}

export interface IChartParam {
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  lpg: number;
  ch4: number;
  co: number;
  alcohol: number;
  co2: number;
  toluen: number;
  nh4: number;
  aceton: number;
  tvoc: number;
  chartType: TypeFilterDate;
  _id: string;
  time: string;
}

export interface Receiver {
  userId: string;
  readAt: string;
}
export interface IThingWarning {
  title: string;
  count: number;
}
