import { Request, Response } from 'express'
import usersServices from '~/services/users.services'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/users.requests'
import { error } from 'node:console'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = (req as any).user._id as string
  const { access_token, refresh_token } = await usersServices.login(user_id)
  return res
    .status(HTTP_STATUS.OK)
    .json({ message: USERS_MESSAGES.LOGIN_SUCCESS, result: { access_token, refresh_token } })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await usersServices.register(req.body)
    return res.status(HTTP_STATUS.CREATED).json({ message: USERS_MESSAGES.REGISTER_SUCCESS, result: result })
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.body
  await usersServices.logout(refresh_token)
  return res.status(HTTP_STATUS.OK).json({ message: USERS_MESSAGES.LOGOUT_SUCCESS })
}
