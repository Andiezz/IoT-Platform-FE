export const PASSWORD_VALIDATION_RULES = {
  MIN_LENGTH: 8,
  REGEX:
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!"#$%&\\\'()*+,-./:;<=>?@[\\]^_`{|}~])[A-Za-z\\d!"#$%&\\\'()*+,-./:;<=>?@[\\]^_`{|}~]{8,}$'
};

export const PHONE_NUMBER_REGEX = /^\d{4,15}$/g;

export const ALPHABETICAL_REGEX = /^[a-zA-Z\s]+$/;

export const WHITES_SPACE = /^\S*$/;
export const NUMBER_IP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
