import { IManager } from 'src/dto/thing.dto';
import { ITimeseriesData } from './overview';

export interface IThing {
  _id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  managers?: IManager[];
  timeseriesData?: ITimeseriesData;
  thingId?: string;
}
