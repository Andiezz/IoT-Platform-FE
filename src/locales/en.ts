import validation from './validation';
import loginPage from './loginPage';
import accountEntity from './accountEntity';
import thingEntity from './thingEntity';

const en = {
  loginPage,
  validation,
  confirm,
  accountEntity,
  thingEntity,
  httpResponseMessage: {
    _400_BadRequest:
      'The server cannot process the request due to a client error.',
    _401_Unauthorized_Access_Denided:
      'Access denied. You do not have the required permissions to access this feature or data. Please contact your administrator for assistance.',
    _401_Unauthorized_Session_Expired:
      'Your session has expired. Please log in again to continue accessing the application.',
    _403_Forbidden:
      'The server understands the request but refuses to authorize it.',
    _404_Not_Found: '404 Page Not Found',
    _500_Internal_Server_Error:
      'The server encountered an unexpected condition that prevented it from fulfilling the request.',
    _502_Bad_Gateway:
      'The server acting as a gateway received an invalid response from the upstream server.',
    _503_Service_Unavailable:
      'The server is currently unavailable due to overload or maintenance.',
    _504_GatewayTimeout:
      'The server acting as a gateway did not receive a timely response from the upstream server.',
    _500_Dashboard_No_Tenant_Data:
      "You're currently not part of any Tenants...",
    _500_Dashboard_No_Thing_Data: "You're currently not part of any Things"
  },

  status: {
    'pending-setup': 'Pending Setup',
    active: 'Active',
    inactive: 'Inactive',
    idle: 'Idle',
    'in-progress': 'In Progress',
    succeeded: 'Succeeded',
    failed: 'Failed',
    queued: 'Queued',
    open: 'Open',
    closed: 'Closed',
    connected: 'Connected',
    disconnected: 'Disconnected'
  },

  confirmationPopup: {
    cancel: 'Are you sure you want to cancel this action?',
    create: 'Are you sure you want to create this record?',
    update: 'Are you sure you want to update this record?',
    delete: 'Are you sure you want to delete this record?',
    remove: 'Are you sure you want to remove this record?',
    removeCustom: 'Are you sure you want to remove: ',
    logout: 'Are you sure you want to logout?',
    cancelBtn: 'Cancel',
    okBtn: 'OK'
  },

  menu: {
    dashboard: 'Dashboard',
    thingCenter: 'Thing Center',
    systemManagement: 'System Management',
    accountManagement: 'Account Management',
    rolesAndPermissions: 'Roles & Permissions',
    myProfile: 'My Profile',
    changePassword: 'Change Password',
    logout: 'Logout'
  },

  label: {
    confirmCorrelationInfo: 'Confirm Correlation Info',
    role: 'Role',
    status: 'Status',
    email: 'Email',
    createdDate: 'Created Date',
    timestamp: 'Timestamp',
    name: 'Name',
    owner: 'Owner',
    tel: 'TEL',
    operations: 'Operations',
    goToDashboard: 'Go to Dashboard',
    thingLocation: 'Thing/Location',
    devices: 'Devices',
  },

  button: {
    cancel: 'Cancel',
    next: 'Next',
    back: 'Back',
    create: 'Create',
    update: 'Update',
    ok: 'OK',
    reset: 'Reset',
    totalEntries: 'Total {{totalEntries}} entries',
    delete: 'Delete',
    add: 'Add',
    remove: 'Remove',
    disable: 'Disable',
    enable: 'Enable',
    done: 'Done',
    confirm: 'Confirm',
    seeMore: 'See More'
  },

  defaultPlaceholder: {
    search: 'Search by Full Name, Email',
    searchAccount: 'Search by Full Name, Email'
  },

  messageIndicator: {
    resetPasswordUnavailable:
      'Password reset request cannot be made to this email until it has been activated.',
    adminPermissionDenied:
      'You do not have permission to view/update service admin (Admin).',
    updateAccountUnavailable:
      'Updates to this user account cannot be made until it has been activated. Please activate the account first before making any changes.',
    deleteThingUnavailable:
      "Deletion is only available for Things with an 'Pending Setup' status.",
    removeThingUnavailable:
      "Removal is only available for Things with an 'Pending Setup' status."
  }
};

export default en;
