import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { addToCartValidator, updateCartValidator } from '~/middlewares/cart.middleware'
import {
  addToCartController,
  getCartController,
  updateCartItemController,
  deleteCartItemController
} from '~/controllers/cart.controller'
import { wrapRequestHandler } from '~/utils/handler'

const cartRouter = Router()

/**
 * Description: Get cart
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
cartRouter.get('/', accessTokenValidator, wrapRequestHandler(getCartController))

/**
 * Description: Add to cart
 * Path: /items
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { product_id: string, buy_count: number, color?: string, size?: string }
 */
cartRouter.post('/items', accessTokenValidator, addToCartValidator, wrapRequestHandler(addToCartController))

/**
 * Description: Update cart item
 * Path: /items/:item_id
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { buy_count: number }
 */
cartRouter.put(
  '/items/:item_id',
  accessTokenValidator,
  updateCartValidator,
  wrapRequestHandler(updateCartItemController)
)

/**
 * Description: Delete cart item
 * Path: /items/:item_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
cartRouter.delete('/items/:item_id', accessTokenValidator, wrapRequestHandler(deleteCartItemController))

export default cartRouter
