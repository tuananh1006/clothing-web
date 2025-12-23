import { Request, Response } from 'express'
import contactService from '~/services/contact.services'

export const submitContactController = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body as {
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
  }
  const result = await contactService.submit({ name, email, phone, subject, message })
  return res.json(result)
}
