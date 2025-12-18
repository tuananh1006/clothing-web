//Validate
import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    username: {
      in: ['body'],
      trim: true,
      isString: { errorMessage: 'Username must be a string' },
      notEmpty: { errorMessage: 'Username is required' }
    },
    email: {
      in: ['body'],
      isEmail: { errorMessage: 'Invalid email format' },
      normalizeEmail: true,
      custom: {
        options: async (value) => {
          const checkEmailExists = await usersServices.checkEmailExists(value)
          if (checkEmailExists) {
            throw new Error('Email is already in use')
          }
          return true
        }
      }
    },
    password: {
      in: ['body'],
      isLength: {
        options: { min: 6 },
        errorMessage: 'Password must be at least 6 characters long'
      }
    },
    confirm_password: {
      in: ['body'],
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: 'Passwords do not match'
      }
    },
    date_of_birth: {
      in: ['body'],
      optional: true,
      isISO8601: {
        options: { strict: true },
        errorMessage: 'Date of birth must be a valid ISO 8601 date'
      }
    }
  })
)
