export const PAGINATION_CONFIGURATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10
};

export enum TABLE_SORT_DIRECTION {
  DESC = -1,
  ASC = 1
}

export const PASSWORD_VALIDATION_RULES = {
	MIN_LENGTH: 8,
	REGEX:
		'^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!"#$%&\\\'()*+,-./:;<=>?@[\\]^_`{|}~])[A-Za-z\\d!"#$%&\\\'()*+,-./:;<=>?@[\\]^_`{|}~]{8,}$'
};

export const LIMIT_RECORD = 50;