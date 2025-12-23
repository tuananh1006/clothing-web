import { Router } from 'express'
import { body } from 'express-validator'
import { submitContactController } from '~/controllers/contact.controller'
import { validate } from '~/utils/validation'

const contactRouter = Router()

contactRouter.post(
  '/submit',
  validate(
    body()
      .custom((value, { req }) => {
        const { name, email, message } = req.body
        if (!name || typeof name !== 'string' || !name.trim()) {
          throw new Error('Tên là bắt buộc')
        }
        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error('Email không hợp lệ')
        }
        if (!message || typeof message !== 'string' || !message.trim()) {
          throw new Error('Nội dung là bắt buộc')
        }
        return true
      })
  ),
  submitContactController
)

export default contactRouter
