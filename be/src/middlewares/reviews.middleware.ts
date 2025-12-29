import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createReviewValidator = validate(
  checkSchema(
    {
      product_id: {
        in: ['body'],
        custom: {
          options: (value) => {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              throw new Error('Product ID is required')
            }
            if (typeof value !== 'string') {
              throw new Error('Product ID must be a string')
            }
            return true
          }
        }
      },
      order_id: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Order ID must be a string' }
      },
      rating: {
        in: ['body'],
        custom: {
          options: (value) => {
            if (value === undefined || value === null || value === '') {
              throw new Error('Rating is required')
            }
            const numValue = typeof value === 'string' ? parseInt(value, 10) : value
            if (isNaN(numValue) || numValue < 1 || numValue > 5) {
              throw new Error('Rating must be an integer between 1 and 5')
            }
            return true
          }
        },
        toInt: true
      },
      comment: {
        in: ['body'],
        optional: { options: { nullable: true } },
        isString: { errorMessage: 'Comment must be a string' },
        isLength: {
          options: { max: 1000 },
          errorMessage: 'Comment must not exceed 1000 characters'
        }
      },
      images: {
        in: ['body'],
        optional: { options: { nullable: true } },
        custom: {
          options: (value, { req }) => {
            // If files are uploaded via multer, skip validation (files are handled separately)
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
              if (req.files.length > 5) {
                throw new Error('Maximum 5 images allowed')
              }
              return true
            }
            // If images are provided as array (URLs), validate them
            if (value !== undefined && value !== null) {
              if (typeof value === 'string') {
                // Try to parse as JSON if it's a string
                try {
                  const parsed = JSON.parse(value)
                  if (Array.isArray(parsed)) {
                    if (parsed.length > 5) {
                      throw new Error('Maximum 5 images allowed')
                    }
                    const allStrings = parsed.every((img) => typeof img === 'string')
                    if (!allStrings) {
                      throw new Error('All images must be strings (URLs)')
                    }
                  }
                } catch {
                  // Not JSON, ignore
                }
              } else if (Array.isArray(value)) {
                if (value.length > 5) {
                  throw new Error('Maximum 5 images allowed')
                }
                const allStrings = value.every((img) => typeof img === 'string')
                if (!allStrings) {
                  throw new Error('All images must be strings (URLs)')
                }
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateReviewValidator = validate(
  checkSchema(
    {
      rating: {
        in: ['body'],
        optional: true,
        custom: {
          options: (value) => {
            if (value === undefined || value === null || value === '') {
              return true // Optional field
            }
            const numValue = typeof value === 'string' ? parseInt(value, 10) : value
            if (isNaN(numValue) || numValue < 1 || numValue > 5) {
              throw new Error('Rating must be an integer between 1 and 5')
            }
            return true
          }
        },
        toInt: true
      },
      comment: {
        in: ['body'],
        optional: { options: { nullable: true } },
        isString: { errorMessage: 'Comment must be a string' },
        isLength: {
          options: { max: 1000 },
          errorMessage: 'Comment must not exceed 1000 characters'
        }
      },
      images: {
        in: ['body'],
        optional: { options: { nullable: true } },
        custom: {
          options: (value, { req }) => {
            // If files are uploaded via multer, skip validation (files are handled separately)
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
              if (req.files.length > 5) {
                throw new Error('Maximum 5 images allowed')
              }
              return true
            }
            // If images are provided as array (URLs), validate them
            if (value !== undefined && value !== null) {
              if (typeof value === 'string') {
                // Try to parse as JSON if it's a string
                try {
                  const parsed = JSON.parse(value)
                  if (Array.isArray(parsed)) {
                    if (parsed.length > 5) {
                      throw new Error('Maximum 5 images allowed')
                    }
                    const allStrings = parsed.every((img) => typeof img === 'string')
                    if (!allStrings) {
                      throw new Error('All images must be strings (URLs)')
                    }
                  }
                } catch {
                  // Not JSON, ignore
                }
              } else if (Array.isArray(value)) {
                if (value.length > 5) {
                  throw new Error('Maximum 5 images allowed')
                }
                const allStrings = value.every((img) => typeof img === 'string')
                if (!allStrings) {
                  throw new Error('All images must be strings (URLs)')
                }
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

