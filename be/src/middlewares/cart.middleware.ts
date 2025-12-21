import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ObjectId } from 'mongodb'

export const addToCartValidator = validate(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: 'Product ID is required'
        },
        isString: true,
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid Product ID')
            }
            return true
          }
        }
      },
      buy_count: {
        notEmpty: true,
        isInt: {
          options: { min: 1 },
          errorMessage: 'Buy count must be a positive integer'
        }
      },
      color: {
        optional: true,
        isString: true
      },
      size: {
        optional: true,
        isString: true
      }
    },
    ['body']
  )
)

export const updateCartValidator = validate(
  checkSchema(
    {
      buy_count: {
        notEmpty: true,
        isInt: {
          options: { min: 1 },
          errorMessage: 'Buy count must be a positive integer'
        }
      }
    },
    ['body']
  )
)
