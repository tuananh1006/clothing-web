import { Router } from 'express'
import { getCategoriesController } from '~/controllers/categories.controller'
import { wrapRequestHandler } from '~/utils/handler'

const categoriesRouter = Router()

/**
 * Description: Get categories list
 * Path: /
 * Method: GET
 * Query Params: { is_featured?: boolean, limit?: number }
 */
categoriesRouter.get('/', wrapRequestHandler(getCategoriesController))

export default categoriesRouter
