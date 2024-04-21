export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

export interface IOptionUserAssign {
  label: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  key: string;
}

export interface IUserBasic {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  isDisable?: string;
  textDisable?: string;
}
export type Owner = IUserBasic

export const messageNotFoundUser = 'User not found';
