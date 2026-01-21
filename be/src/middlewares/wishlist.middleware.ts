import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { ObjectId } from 'mongodb'

export const wishlistValidator = validate(
  checkSchema(
    {
      product_id: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'product_id is required'
        },
        isString: {
          errorMessage: 'product_id must be a string'
        },
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus('product_id is not a valid ObjectId', HTTP_STATUS.UNPROCESSABLE_ENTITY)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)


