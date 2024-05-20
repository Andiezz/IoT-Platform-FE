export enum HTTP_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export enum HTTP_STATUS_CODE {
  SUCCESS = '200',
  BAD_REQUEST = '400',
  NOT_FOUND = '404',
  AUTHORIZATION = '401',
  FORBIDDEN = '403',
  UNKNOWN = '520'
}

export enum HTTP_STATUS_RESPONSE_KEY {
  SUCCESS = '000200',
  BAD_REQUEST = '000400',
  NOT_FOUND = '000404',
  AUTHORIZATION = '000401',
  FORBIDDEN = '000403',
  UNKNOWN = '000500'
}

export enum ENDPOINT {
  ROOT = '/api',
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  FORGOT_PASSWORD = '/auth/forgot-password',
  CHANGE_PASSWORD = '/auth/create-new-password',
  CHANGE_ACCOUNT_PASSWORD = '/user/change-password',
  REFRESH_TOKEN = '/auth/refresh-token',
  GET_USER_PROFILE = '/user/profile',
  UPDATE_USER_PROFILE = '/user/update-profile',
  ACTIVE_ACCOUNT = '/user-mgt/account/activate',

  // Account management
  GET_ACCOUNT_LIST = '/system-mgt/account/view',
  GET_ACCOUNT_DETAIL = '/system-mgt/view/:id',
  CREATE_ACCOUNT = '/system-mgt/account/create',
  UPDATE_ACCOUNT = '/system-mgt/account/update/:id',
  GET_LIST_USER_ASSIGN = 'user/view/list',
  GET_NEW_LINK_ACTIVE_ACCOUNT = '/system-mgt/account/resent-active-link',
  GET_USER_ASSIGN_BY_EMAIL = '/user/email',

  // Thing
  THING_BASE_URL = '/thing',
  THING_PARAM_URL = '/thing/:id',
  DOWNLOAD_CERTIFICATE = '/thing/certificate/:id',
  GET_USER_ASSIGN_MANAGER_BY_EMAIL = '/thing/manager',

  //Parameter
  GET_PARAMETER_LIST = '/parameter-standard',
  CREATE_PARAMETER = '/parameter-standard',
  UPDATE_PARAMETER = '/parameter-standard/:id',
  DELETE_PARAMETER = '/parameter-standard/:id',
  GET_PARAMETER_DETAIL = '/parameter-standard/:id',

  //Device Model
  GET_DEvICE_MODEL_LIST = '/device-model',
  CREATE_DEVICE_MODEL = '/device-model',
  UPDATE_DEVICE_MODEL = '/device-model/:id',
  DELETE_DEVICE_MODEL = '/device-model/:id',
  GET_DEVICE_MODEL_DETAIL = '/device-model/:id'
}
