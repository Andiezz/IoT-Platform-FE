export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUserRole {
  _id: string;
  name: string;
  role: Role;
}

export interface IUserInfo {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneCode: string;
  role: Role;
  avatar?: string;
}

export interface IUserResponseGetByEmail {
  _id: string;
  email: string;
  avatar?: string;
  firstName: string;
  lastName: string;
}

export interface IAccountInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  isActive: true;
  role: Role;
  tenants: string[];
}
