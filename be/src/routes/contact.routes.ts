import { Router } from 'express'
import { body } from 'express-validator'
import { submitContactController } from '~/controllers/contact.controller'
import { validate } from '~/utils/validation'

const contactRouter = Router()

contactRouter.post(
  '/submit',
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  // message
  body('message').isString().notEmpty().withMessage('Message is required'),
  validate,
  submitContactController
)

export default contactRouter
