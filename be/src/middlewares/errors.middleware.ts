import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { omit } from 'lodash'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, 'status'))
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperties(err, {
      key: {
        enumerable: true
      }
    })
  })
  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || 'Internal Server Error', errorInfo: omit(err, 'stack') })
}
