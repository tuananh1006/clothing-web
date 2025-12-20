import { checkSchema } from 'express-validator'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseServices from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { config } from 'dotenv'
config()
export const loginValidator = validate(
  checkSchema({
    email: {
      in: ['body'],
      isEmail: { errorMessage: USERS_MESSAGES.INVALID_EMAIL_FORMAT },
      normalizeEmail: true,
      notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_AND_PASSWORD_REQUIRED },
      custom: {
        options: async (value, { req }) => {
          const user = await databaseServices.users.findOne({ email: value, password: hashPassword(req.body.password) })
          if (user === null) {
            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_AND_PASSWORD_REQUIRED },
      isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING },
      isLength: {
        options: { min: 6 },
        errorMessage: USERS_MESSAGES.PASSWORD_MIN_LENGTH
      }
    }
  })
)
export const registerValidator = validate(
  checkSchema({
    username: {
      in: ['body'],
      trim: true,
      isString: { errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_STRING },
      notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_IS_REQUIRED }
    },
    email: {
      in: ['body'],
      isEmail: { errorMessage: USERS_MESSAGES.INVALID_EMAIL_FORMAT },
      normalizeEmail: true,
      custom: {
        options: async (value) => {
          const checkEmailExists = await usersServices.checkEmailExists(value)
          if (checkEmailExists) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_IN_USE)
          }
          return true
        }
      }
    },
    password: {
      in: ['body'],
      isLength: {
        options: { min: 6 },
        errorMessage: USERS_MESSAGES.PASSWORD_MIN_LENGTH
      }
    },
    confirm_password: {
      in: ['body'],
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: USERS_MESSAGES.PASSWORDS_NOT_MATCH
      }
    },
    date_of_birth: {
      in: ['body'],
      optional: true,
      isISO8601: {
        options: { strict: true },
        errorMessage: USERS_MESSAGES.INVALID_DATE_OF_BIRTH
      }
    }
  })
)
