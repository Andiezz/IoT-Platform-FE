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
  DASHBOARD_THING = '/thing',
  THING_DETAIL = '/thing/:id',
  THING_UPDATE = '/thing/update-thing/:id',
  THING_CREATE = '/thing/create-thing',
}

