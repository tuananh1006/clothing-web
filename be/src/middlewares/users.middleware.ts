//Validate
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: USERS_MESSAGES.USERNAME_AND_PASSWORD_REQUIRED })
  }
  next()
}

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
