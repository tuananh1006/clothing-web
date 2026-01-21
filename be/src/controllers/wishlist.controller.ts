import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import wishlistService from '~/services/wishlist.services'
import HTTP_STATUS from '~/constants/httpStatus'

export const getWishlistController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.decoded_authorization as any
    const items = await wishlistService.getUserWishlist(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get wishlist success',
      data: {
        items: items.map((item) => item.product)
      }
    })
  } catch (error) {
    next(error)
  }
}

export const addToWishlistController = async (
  req: Request<ParamsDictionary, any, { product_id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.decoded_authorization as any
    const { product_id } = req.body
    await wishlistService.addToWishlist(userId, product_id)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Add to wishlist success'
    })
  } catch (error) {
    next(error)
  }
}

export const removeFromWishlistController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.decoded_authorization as any
    const { product_id } = req.params
    await wishlistService.removeFromWishlist(userId, product_id)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Remove from wishlist success'
    })
  } catch (error) {
    next(error)
  }
}


