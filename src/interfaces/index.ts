export interface IOptions {
  id?: string;
  key: string;
  value: string | number | boolean;
  label: string;
}

export interface IPosition {
  lat?: number;
  lng?: number;
  id?: number;
  address?: string;
}

export interface IThingMap {
  address?: string;
  lat: number;
  lng: number;
  tenantName?: string;
  thingName?: string;
}
