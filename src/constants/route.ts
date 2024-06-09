export enum PAGE_ROUTE {
  LOGIN = '/login',
  NOT_FOUND = '/404',
  DASHBOARD = '/',
  FORGOT_PASSWORD = '/forgot-password',
  CHANGE_PASSWORD = '/change-password',
  ACCOUNT_MANAGEMENT = '/account',
  NEW_ACCOUNT = '/account/new',
  UPDATE_ACCOUNT = '/account/update/:id',

  PROFILE = '/profile',
  PROFILE_CHANGE_PASSWORD = '/profile/change-password',
  LOGOUT = '/logout',
  ACCESS_DENIED = '/access-denied',

  // Thing
  THING_CENTER = '/thing',
  THING_DETAIL = '/thing/:id',
  THING_UPDATE = '/thing/update-thing/:id',
  THING_CREATE = '/thing/create-thing',

  // Master data: parameter, device model
  MASTER_DATA = '/master-data',
  PARAMETER = '/parameter',
  NEW_PARAMETER = '/parameter/new',
  UPDATE_PARAMETER = '/parameter/update/:id',
  DEVICE_MODEL = '/device-model',
  NEW_DEVICE_MODEL = '/device-model/new',
  UPDATE_DEVICE_MODEL = '/device-model/update/:id',
  DASHBOARD_OVERVIEW_THING = '/dashboard/overview/:id',
}

