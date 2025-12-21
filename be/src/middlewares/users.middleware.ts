import { checkSchema } from 'express-validator'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseServices from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { config } from 'dotenv'
import { verifyToken } from '~/utils/jwt'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
config()
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        in: ['body'],
        isEmail: { errorMessage: USERS_MESSAGES.INVALID_EMAIL_FORMAT },
        normalizeEmail: true,
        notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_AND_PASSWORD_REQUIRED },
        custom: {
          options: async (value, { req }) => {
            const user = await databaseServices.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
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
      },
      remember_me: {
        in: ['body'],
        optional: true,
        isBoolean: { errorMessage: 'Remember me must be boolean' }
      }
    },
    ['body']
  )
)
export const registerValidator = validate(
  checkSchema(
    {
      first_name: {
        in: ['body'],
        trim: true,
        isString: { errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_STRING },
        notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_IS_REQUIRED }
      },
      last_name: {
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
      password_confirmation: {
        in: ['body'],
        custom: {
          options: (value, { req }) => value === req.body.password,
          errorMessage: USERS_MESSAGES.PASSWORDS_NOT_MATCH
        }
      },
      agree_terms: {
        in: ['body'],
        isBoolean: { errorMessage: 'Agree terms must be boolean' },
        custom: {
          options: (value) => {
            if (value !== true) {
              throw new Error('You must agree to the terms and conditions')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema({
    Authorization: {
      custom: {
        options: async (value, { req }) => {
          const access_token = value.split(' ')[1]
          if (access_token == '') {
            throw new ErrorWithStatus(USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
          }
          const decodedVerifyToken = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.JWT_SECRET
          })
          req.decoded_authorization = decodedVerifyToken
          return true
        }
      }
    }
  })
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus(USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET as string }),
                databaseServices.refreshTokens.findOne({ token: value })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus(USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST, HTTP_STATUS.UNAUTHORIZED)
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof ErrorWithStatus) {
                throw error
              }
              throw new ErrorWithStatus(USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST, HTTP_STATUS.UNAUTHORIZED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const socialLoginValidator = validate(
  checkSchema(
    {
      provider: {
        in: ['body'],
        notEmpty: { errorMessage: USERS_MESSAGES.PROVIDER_IS_REQUIRED },
        isIn: {
          options: [['google', 'facebook']],
          errorMessage: 'Provider must be google or facebook'
        }
      },
      token: {
        in: ['body'],
        notEmpty: { errorMessage: USERS_MESSAGES.TOKEN_IS_REQUIRED },
        isString: { errorMessage: 'Token must be string' }
      },
      device_name: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Device name must be string' }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        in: ['body'],
        isEmail: { errorMessage: USERS_MESSAGES.INVALID_EMAIL_FORMAT },
        notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_AND_PASSWORD_REQUIRED }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      token: {
        in: ['body'],
        notEmpty: { errorMessage: USERS_MESSAGES.TOKEN_IS_REQUIRED },
        isString: { errorMessage: 'Token must be string' },
        custom: {
          options: async (value, { req }) => {
            try {
              const decoded = await verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET as string })
              const user = await databaseServices.users.findOne({
                _id: new ObjectId(decoded.userId),
                forgot_password_token: value
              })
              if (user === null) {
                throw new ErrorWithStatus(USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.UNAUTHORIZED)
              }
              req.decoded_forgot_password_token = decoded
              req.user = user
            } catch (error) {
              if (error instanceof ErrorWithStatus) {
                throw error
              }
              throw new ErrorWithStatus(USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.UNAUTHORIZED)
            }
            return true
          }
        }
      },
      email: {
        in: ['body'],
        isEmail: { errorMessage: USERS_MESSAGES.INVALID_EMAIL_FORMAT },
        notEmpty: { errorMessage: USERS_MESSAGES.USERNAME_AND_PASSWORD_REQUIRED }
      },
      password: {
        in: ['body'],
        isLength: {
          options: { min: 6 },
          errorMessage: USERS_MESSAGES.PASSWORD_MIN_LENGTH
        },
        isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRING }
      },
      password_confirmation: {
        in: ['body'],
        custom: {
          options: (value, { req }) => value === req.body.password,
          errorMessage: USERS_MESSAGES.PASSWORDS_NOT_MATCH
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus(USERS_MESSAGES.TOKEN_IS_REQUIRED, HTTP_STATUS.UNAUTHORIZED)
            }
            try {
              const decoded = await verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET as string })
              const user = await databaseServices.users.findOne({
                _id: new ObjectId(decoded.userId),
                forgot_password_token: value
              })
              if (user === null) {
                throw new ErrorWithStatus(USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.UNAUTHORIZED)
              }
              req.decoded_forgot_password_token = decoded
            } catch (error) {
              if (error instanceof ErrorWithStatus) {
                throw error
              }
              throw new ErrorWithStatus(USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN, HTTP_STATUS.UNAUTHORIZED)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
