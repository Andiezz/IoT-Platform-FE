import { Role } from 'src/interfaces/user';
import { STATUS } from './status';
import { Owner } from './user';

export interface Thing {
  name: string;
  tenant_id: string;
  address: string;
  timezone: string;
  path: string;
  information: string;
}

export interface ILocation {
  _id: string;
  name: string;
  tenant_id: string;
  information: string;
  address: string;
  timezone: string;
  path: null | string;
  type?: 'thing';
  locations?: ILocation[];
}

// // export interface IThingItem {
// //   _id: string;
// //   name: string;
// //   status: string;
// //   owner: {
// //     user: Owner;
// //   };
// //   location: {
// //     _id: string;
// //     name: string;
// //     address: string;
// //     status: string;
// //     location: {
// //       longitude: number;
// //       latitude: number;
// //     };
// //   };
// //   associated_assets: [
// //     {
// //       _id: string;
// //       name: string;
// //       information: number;
// //       device_type_id: string;
// //       device_type: {
// //         _id: string;
// //         name: string;
// //       };
// //     }
// //   ];

// //   tenant?: {
// //     _id: string;
// //     name: string;
// //   };
// // }

// export interface IThingDetail extends IThingItem {
//   viewers: [
//     {
//       user: Owner;
//     }
//   ];
//   ems: {
//     _id: string;
//     status: string;
//   };
// }

export interface IThingItemInit {
  _id: string;
  createdOn: Date;
  name: string;
  status: STATUS;
  address: string;
  longitude: number;
  latitude: number;
  location_name: string;
  devices: {
    company: string;
    capacity: number;
    device_type_id: string;
  }[];
  device_types: {
    _id: string;
    name: string; //PV Inventer
  }[];
  viewers: { user: Owner; role: { role: Role } }[];
  tenant?: {
    _id: string;
    name: string;
  };
}
export interface IThingItem extends IThingItemInit {
  owner: {
    user: Owner;
  };
}

export interface IThingDetail extends IThingItemInit {
  owner: { user: Owner }[];
}

export interface IThingListCenter {
  current: number;
  limit: number;
  page: number;
  paginatedResults: Array<IThingItem>;
  total: number;
}
