export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

export interface IUserInfo {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  phone_code: string;
  role: Role;
  avatar?: string;
}

export interface IUserResponseGetByEmail {
  _id: string;
  email: string;
  avatar?: string;
  first_name: string;
  last_name: string;
}

export interface IAccountInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  is_active: true;
  role: Role;
  tenants: string[];
}
