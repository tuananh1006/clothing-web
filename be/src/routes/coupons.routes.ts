import { Router } from 'express'
import { validateCouponController, getCouponByCodeController, getAvailableCouponsController } from '~/controllers/coupons.controller'
import { optionalAccessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const couponsRouter = Router()

/**
 * Description: Validate coupon
 * Path: /validate
 * Method: POST
 * Header: { Authorization: Bearer <access_token> } (optional)
 * Body: { code, order_value, product_ids?, category_ids? }
 */
couponsRouter.post('/validate', optionalAccessTokenValidator, wrapRequestHandler(validateCouponController))

/**
 * Description: Get coupon by code
 * Path: /code
 * Method: GET
 * Query Params: { code }
 */
couponsRouter.get('/code', wrapRequestHandler(getCouponByCodeController))

/**
 * Description: Get available coupons
 * Path: /available
 * Method: GET
 * Header: { Authorization: Bearer <access_token> } (optional)
 * Query Params: { order_value? }
 */
couponsRouter.get('/available', optionalAccessTokenValidator, wrapRequestHandler(getAvailableCouponsController))

export default couponsRouter

