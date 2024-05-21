import { STATUS } from './status';

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
  Idle = 'Idle',
  Pending = 'Pending Setup',
  PendingSetup = 'pending-setup'
}

interface IStatus {
  [key: string]: string | undefined;
}

export const convertStatusUser = (status?: string) => {
  return status ? 'Active' : 'Inactive';
};

const StatusOb: IStatus = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending Setup'
};

export const tagColorStatus = (status: string) => {
  switch (status) {
    case STATUS.ACTIVE.toLowerCase():
      return { background: 'rgba(80, 200, 120, 0.1)', color: '#50C878' };
    case STATUS.INACTIVE.toLowerCase():
      return { background: 'rgba(204, 204, 204, 0.20)', color: '#8E8E93' };
    case STATUS.PENDING_SETUP.toLowerCase():
      return { background: 'rgba(255, 163, 0, 0.10)', color: '#FFA300' };
    default:
      return { background: 'rgba(204, 204, 204, 0.2)', color: '#8E8E93' };
  }
};

export const getStatus = (status?: string) => {
  if (status === 'pending-setup') status = 'pending';
  if (status) return StatusOb[status.toLowerCase()];
};

export const capitalizedStr = (str?: string) => {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
};

export const timeout = (
  ms: number
): { promise: Promise<string>; cancel(): void } => {
  let timeout: ReturnType<typeof setTimeout>;
  const promiseTimeout: Promise<string> = new Promise(function (resolve) {
    timeout = setTimeout(function () {
      resolve('timeout done');
    }, ms);
  });

  return {
    promise: promiseTimeout,
    cancel: function () {
      clearTimeout(timeout);
    } //return a canceller as well
  };
};
