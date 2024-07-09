import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Colors,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { Dayjs } from 'dayjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Colors,
  Tooltip,
  Legend,
  BarElement,
  TimeScale,
  zoomPlugin
);

export enum TypeFilterDate {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  total = 'total'
}
export interface IValueForm {
  unit: 'kwOrkwh' | 'percent';
  date: Dayjs;
  type: TypeFilterDate;
}

export interface SearchField {
  from: string;
  to: string;
  type: TypeFilterDate;
}
