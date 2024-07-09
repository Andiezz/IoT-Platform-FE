export enum TypeFilterDate {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
  total = 'total'
}

export interface SearchField {
  from: string;
  to: string;
  type: TypeFilterDate;
}
