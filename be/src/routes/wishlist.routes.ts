import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController
} from '~/controllers/wishlist.controller'
import { wishlistValidator } from '~/middlewares/wishlist.middleware'

const wishlistRouter = Router()

/**
 * Description: Get current user's wishlist
 * Path: /wishlists
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
wishlistRouter.get(
  '/',
  accessTokenValidator,
  wrapRequestHandler(getWishlistController)
)

/**
 * Description: Add product to wishlist
 * Path: /wishlists
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { product_id: string }
 */
wishlistRouter.post(
  '/',
  accessTokenValidator,
  wishlistValidator,
  wrapRequestHandler(addToWishlistController)
)

/**
 * Description: Remove product from wishlist
 * Path: /wishlists/:product_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
wishlistRouter.delete(
  '/:product_id',
  accessTokenValidator,
  wrapRequestHandler(removeFromWishlistController)
)

export default wishlistRouter


