import { Router } from 'express'
import {
  getProductsController,
  getProductDetailController,
  getRelatedProductsController
} from '~/controllers/products.controller'
import { wrapRequestHandler } from '~/utils/handler'

const productsRouter = Router()

/**
 * Description: Get products list
 * Path: /
 * Method: GET
 * Query Params: { page, limit, category_slug, name, sort_by, order, price_min, price_max, rating_filter, is_featured }
 */
productsRouter.get('/', wrapRequestHandler(getProductsController))

/**
 * Description: Get product detail
 * Path: /:slug
 * Method: GET
 */
productsRouter.get('/:slug', wrapRequestHandler(getProductDetailController))

/**
 * Description: Get related products
 * Path: /:slug/related
 * Method: GET
 */
productsRouter.get('/:slug/related', wrapRequestHandler(getRelatedProductsController))

export default productsRouter
