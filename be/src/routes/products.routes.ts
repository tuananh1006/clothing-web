import { Router } from 'express'
import { getProductsController, getProductDetailController } from '~/controllers/products.controller'
import { wrapRequestHandler } from '~/utils/handler'

const productsRouter = Router()

/**
 * Description: Get products list
 * Path: /
 * Method: GET
 * Query Params: { page, limit, category_slug, name, sort_by, order, price_min, price_max, rating_filter }
 */
productsRouter.get('/', wrapRequestHandler(getProductsController))

/**
 * Description: Get product detail
 * Path: /:slug
 * Method: GET
 */
productsRouter.get('/:slug', wrapRequestHandler(getProductDetailController))

export default productsRouter
