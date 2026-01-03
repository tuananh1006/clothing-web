import { Router } from 'express'
import {
  createReviewController,
  getProductReviewsController,
  updateReviewController,
  deleteReviewController,
  markHelpfulController,
  getAllReviewsController,
  moderateReviewController
} from '~/controllers/reviews.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { requireAdmin } from '~/middlewares/admin.middleware'
import { createReviewValidator, updateReviewValidator } from '~/middlewares/reviews.middleware'
import { uploadReviewImages } from '~/middlewares/upload.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const reviewsRouter = Router()

/**
 * Description: Get product reviews
 * Path: /products/:product_id/reviews
 * Method: GET
 * Query: { page?, limit?, sort_by? }
 */
reviewsRouter.get('/products/:product_id/reviews', (req, res, next) => {
  console.log('Reviews route hit:', req.path, req.params)
  next()
}, wrapRequestHandler(getProductReviewsController))

/**
 * Description: Create review
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { product_id, order_id?, rating, comment?, images? } (multipart/form-data with image files)
 */
reviewsRouter.post(
  '/',
  accessTokenValidator,
  uploadReviewImages,
  createReviewValidator,
  wrapRequestHandler(createReviewController)
)

/**
 * Description: Update review
 * Path: /:review_id
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { rating?, comment?, images? } (multipart/form-data with image files)
 */
reviewsRouter.put(
  '/:review_id',
  accessTokenValidator,
  uploadReviewImages,
  updateReviewValidator,
  wrapRequestHandler(updateReviewController)
)

/**
 * Description: Delete review
 * Path: /:review_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
reviewsRouter.delete('/:review_id', accessTokenValidator, wrapRequestHandler(deleteReviewController))

/**
 * Description: Mark review as helpful
 * Path: /:review_id/helpful
 * Method: POST
 * Body: { helpful: boolean }
 */
reviewsRouter.post('/:review_id/helpful', accessTokenValidator, wrapRequestHandler(markHelpfulController))

// Admin routes
/**
 * Description: Get all reviews (Admin)
 * Path: /admin/all
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { page?, limit?, status?, product_id? }
 */
reviewsRouter.get('/admin/all', accessTokenValidator, requireAdmin, wrapRequestHandler(getAllReviewsController))

/**
 * Description: Moderate review (Admin)
 * Path: /admin/:review_id/moderate
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { status: 'approved' | 'rejected' }
 */
reviewsRouter.put('/admin/:review_id/moderate', accessTokenValidator, requireAdmin, wrapRequestHandler(moderateReviewController))

export default reviewsRouter

