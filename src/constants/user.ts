export enum Role {
  ADMIN = 'Admin',
  USER = 'User'
}

export interface IOptionUserAssign {
  label: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  key: string;
}

export interface IUserBasic {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isDisable?: string;
  textDisable?: string;
}
export type Owner = IUserBasic

export const messageNotFoundUser = 'User not found';
