import { Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/users.requests'
import { error } from 'node:console'

export const loginController = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (username === 'admin' && password === 'password') {
    return res.json({ message: 'Login successful' })
  } else {
    next(error)
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersServices.register(req.body)
    return res.status(201).json({ message: 'Register success', result: result })
  } catch (error) {
    next(error)
  }
}
