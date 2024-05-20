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
    ipValidation: 'Please enter a valid ip number.',

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

  thingAndLocation: {
    locationAutocompleteErr:
      'Please select a location from the autocomplete results. Free text input is not allowed in this field.',

    existingLocationName:
      'That Location name already exists in this Thing. Please choose a unique name.',

    cantUpdateBecauseNotOwnerThing:
      'Update cannot be performed because your account is not the owner of this thing'
  },

  thing: {
    existingName: 'Thing name has already existed',

    requiredOwner: 'Please assign owner',

    requiredRoleOwner:
      'Access Denied: Only Tenant Admin have the permission to be assigned as a Thing Owner.',

    existingEmailInList:
      'Duplicate Assignment: The selected user is already assigned as a Owner.',

    existingEmailInOwner:
      'Assignment Conflict: This user is already assigned as the Thing Manager.',
      
    limitAssignOwner:
      'Assignment Limit Exceeded: Only one user can be assigned to a Thing at a time.',
  }
};

export default validation;
