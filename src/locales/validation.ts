const validation = {
  common: {
    networkConnectionError:
      "Oops! It looks like you've lost your internet connection. Please check your network settings and try again.",

    requiredField: 'Please fill out this field.',

    requiredNumber: 'Please enter format number',

    loginSuccess: 'Logged in successfully!',

    toastDeleteSuccess: 'Record have been successfully deleted!',

    toastRemoveSuccess: 'Record have been successfully removed!',

    toastCreateSuccess: 'Record have been successfully created!',

    toastUpdateSuccess: 'Record have been successfully updated!',

    toastCancelSuccess: 'Action has been successfully cancelled!',

    toastDeleteFail: 'Failed to delete the record. Please try again!',

    toastRemoveFail: 'Failed to remove the record. Please try again!',

    toastCreateFail: 'Failed to create the record. Please try again!',

    toastUpdateFail: 'Failed to update the record. Please try again!',

    existingName:
      'The name you entered already exists. Please choose a unique name.',

    toastRefreshSuccess:
      'Data updated successfully! You are now viewing the latest information.',

    toastRefreshFail: 'Failed to refresh the record. Please try again!',

    timeoutRefresh: 'Refresh time exceeded. Please try again!'
  },

  emailOrPassword: {
    invalidEmailOrPassword: 'Invalid Email or Password.',

    invalidEmail: 'Please enter a valid email.',

    passwordDoNotMatch: 'Password do not match. Please try again.',

    passwordMismatch: 'The two passwords that you entered do not match.',

    passwordPattern:
      'Please ensure that your password meets the following criteria: minimum character length of 8, at least 1 capital letter, 1 non-capital letter, 1 special character, and 1 number.',

    sendMailResultSuccess:
      'An email has been sent to your registered email address with instructions on how to reset your password. Please check your inbox and spam folder.',

    sendMailResultFail:
      "We're sorry, but we were unable to send a password reset email to your registered email address. Please try again later or contact customer support for assistance.",

    changePasswordSuccess:
      'Your password has been successfully changed. Please use your new password to log in to your account.',

    changePasswordFail:
      'Password change failed. Please make sure you have entered the correct current password and try again. If you continue to have trouble, please contact customer support for assistance.',

    passwordDifferentFromCurrent:
      'Please enter a new password that is different from your current password.'
  },

  account: {
    alphabeticalValidation: 'Please enter only alphabetical characters.',

    phoneValidation:
      'Please enter a valid phone number (only numerical characters are allowed).',
    ipValidation:
      'Please enter a valid ip number.',

    existingEmail: 'Email already exists in the system.',

    invalidImageFileTypes: 'Please upload only jpeg, png, or jpg files.',

    avatarUploadSizeError:
      'File size too large. Please upload an image that is no larger than {{maxsize}}MB.',

    unfoundEmail: 'Email address not found.',

    inactiveAccountNotification:
      'Your account is currently inactive. Please contact customer support for assistance in reactivating your account.',
    inactiveAssign:
      'Only users with an Active status have permission to be assigned',
    activationLinkExpired:
      'Activation link expired. Please contact the administrator to generate a new activation link and activate your account.',

    resentActiveLinkFail: 'Resent new active link failed. Please try again!',

    resentActiveLinkSuccess: 'Resent new active link successfully!',

    existingEmailOwner:
      'This email already in list. Please provide another name.'
  },

  plantAndLocation: {
    locationAutocompleteErr:
      'Please select a location from the autocomplete results. Free text input is not allowed in this field.',

    existingLocationName:
      'That Location name already exists in this Plant. Please choose a unique name.',

    cantUpdateBecauseNotOwnerPlant:
      'Update cannot be performed because your account is not the owner of this plant'
  },

  ems: {
    existingEms: 'This EMS name already exists. Please provide another name.',

    mustDownloadKeyFiles: 'You must download the key files before you create.',

    emsLocationAllocationError:
      '1 EMS can not be allocated to more than 1 location.',
    inactiveDeviceCommand:
      'The command cannot be executed because this device is inactive.',
    locationEmsAllocationError: '1 location cannot have more than 1 EMS.',

    duplicatedCompanyDeviceTypeError:
      'There is a duplicated set of company and device types section in the Associated Assets list. Please check and remove this duplicated value.'
  },

  plant: {
    existingName: 'Plant name has already existed',

    requiredOwner: 'Please assign owner',

    requiredRoleOwner:
      'Access Denied: Only Tenant Admin have the permission to be assigned as a Plant Owner.',

    requiredRoleViewer:
      'Access Denied: Only Tenant Admin/ Viewer and Customer Services have the permission to be assigned as a Tenant.',

    limitAssignOwner:
      'Assignment Limit Exceeded: Only one user can be assigned to a plant at a time.',

    existingEmailInList:
      'Duplicate Assignment: The selected user is already assigned as a Tenant.',

    existingEmailInOwner:
      'Assignment Conflict: This user is already assigned as the Plant Owner and cannot be assigned to the Tenant Assignment as well.',

    existingEmailInViewer:
      'Assignment Conflict: This user is already assigned as the Tenant Assignment and cannot be assigned to the Plant Owner as well.'
  },

  tenant: {
    existingName: 'Tenant name has already existed',

    requiredAtLeastOneTenantOwner: 'Please select at least one Tenant Owner.',

    accountNotOwnerTenant: 'Current account is not owner of this tenant',

    cantUpdateBecauseNotOwnerTenant:
      'Update cannot be performed because your account is not the owner of this tenant'
  },

  overview: {
    setSocValue: 'Please input number of value can not be more than 100.',

    setSocLimitation:
      'Please enter the number of Min value field not to be large than field Max.'
  }
};

export default validation;
