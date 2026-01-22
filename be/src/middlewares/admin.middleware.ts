import { Request, Response, NextFunction } from 'express'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import HTTP_STATUS from '~/constants/httpStatus'

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = (req as any).decoded_authorization as { userId?: string }
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const user = await databaseServices.users.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    // Kiểm tra account bị khóa
    if (user.verify === UserVerifyStatus.Banned) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.' })
    }
    if (user.role !== UserRole.Admin && user.role !== UserRole.Staff) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' })
    }
    next()
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateProductValidator = validate(
  checkSchema(
    {
      name: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Name must be a string' },
        trim: true
      },
      description: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Description must be a string' }
      },
      price: {
        in: ['body'],
        optional: true,
        isNumeric: { errorMessage: 'Price must be a number' },
        custom: {
          options: (value) => {
            if (value !== undefined && (isNaN(value) || value < 0)) {
              throw new Error('Price must be a positive number')
            }
            return true
          }
        }
      },
      quantity: {
        in: ['body'],
        optional: true,
        isInt: { errorMessage: 'Quantity must be an integer' },
        custom: {
          options: (value) => {
            if (value !== undefined && (isNaN(value) || value < 0)) {
              throw new Error('Quantity must be a non-negative integer')
            }
            return true
          }
        }
      },
      status: {
        in: ['body'],
        optional: true,
        isIn: {
          options: [['active', 'inactive', 'out_of_stock', 'low_stock', 'draft']],
          errorMessage: 'Invalid status'
        }
      },
      image: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Image URL must be a string' },
        trim: true
      },
      category_id: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Category ID must be a string' },
        trim: true
      },
      colors: {
        in: ['body'],
        optional: true,
        isArray: { errorMessage: 'Colors must be an array' }
      },
      sizes: {
        in: ['body'],
        optional: true,
        isArray: { errorMessage: 'Sizes must be an array' }
      },
      is_featured: {
        in: ['body'],
        optional: true,
        isBoolean: { errorMessage: 'is_featured must be a boolean' }
      }
    },
    ['body']
  )
)

export const updateCustomerStatusValidator = validate(
  checkSchema(
    {
      status: {
        in: ['body'],
        isString: { errorMessage: 'Status must be a string' },
        notEmpty: { errorMessage: 'Status is required' },
        isIn: {
          options: [['active', 'inactive']],
          errorMessage: 'Status must be either "active" or "inactive"'
        }
      }
    },
    ['body']
  )
)

export const updateSettingsGeneralValidator = validate(
  checkSchema(
    {
      store_name: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Store name must be a string' },
        trim: true
      },
      store_email: {
        in: ['body'],
        optional: true,
        isEmail: { errorMessage: 'Valid email is required' },
        normalizeEmail: true
      },
      store_phone: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Store phone must be a string' },
        trim: true
      },
      store_address: {
        in: ['body'],
        optional: true,
        isString: { errorMessage: 'Store address must be a string' },
        trim: true
      }
    },
    ['body']
  )
)

export const updateOrderStatusValidator = validate(
  checkSchema(
    {
      status: {
        in: ['body'],
        isString: { errorMessage: 'Status must be a string' },
        notEmpty: { errorMessage: 'Status is required' },
        isIn: {
          options: [['pending', 'processing', 'shipping', 'completed', 'cancelled']],
          errorMessage: 'Status must be one of: pending, processing, shipping, completed, cancelled'
        }
      }
    },
    ['body']
  )
)
