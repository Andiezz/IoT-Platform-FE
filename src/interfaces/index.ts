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

export interface IPlantMap {
  address?: string;
  lat: number;
  lng: number;
  tenantName?: string;
  plantName?: string;
}
