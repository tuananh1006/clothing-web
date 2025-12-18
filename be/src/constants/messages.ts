export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error occurred',
  LOGIN_FAILED: 'Invalid username or password',
  REGISTER_SUCCESS: 'User registered successfully',
  USERNAME_IS_REQUIRED: 'Username is required',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_AND_PASSWORD_REQUIRED: 'Username and password are required',
  INVALID_EMAIL_FORMAT: 'Invalid email format',
  EMAIL_ALREADY_IN_USE: 'Email is already in use',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  INVALID_DATE_OF_BIRTH: 'Date of birth must be a valid ISO 8601 date'
} as const
