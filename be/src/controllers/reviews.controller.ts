import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import reviewsServices from '~/services/reviews.services'
import cloudinaryService from '~/services/cloudinary.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { CreateReviewReqBody, UpdateReviewReqBody } from '~/models/requests/review.requests'

export const createReviewController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const body = req.body as any

  // Debug logging
  console.log('Create Review - Body:', body)
  console.log('Create Review - Files:', req.files)
  console.log('Create Review - Content-Type:', req.headers['content-type'])

  try {
    // Parse rating from string to number if needed
    const rating = typeof body.rating === 'string' ? parseInt(body.rating, 10) : body.rating
    
    // Validate required fields
    if (!body.product_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product ID is required'
      })
    }
    
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Rating must be between 1 and 5'
      })
    }

    // Upload images to Cloudinary if files are provided
    let imageUrls: string[] = []
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      try {
        const files = req.files as Express.Multer.File[]
        console.log('Uploading', files.length, 'images to Cloudinary...')
        const uploadResults = await cloudinaryService.uploadImages(
          files.map((f) => f.buffer),
          'reviews'
        )
        imageUrls = uploadResults.map((r) => r.secure_url)
        console.log('Upload successful, image URLs:', imageUrls)
      } catch (uploadError: any) {
        console.error('Cloudinary upload error:', uploadError)
        // Check if Cloudinary is not configured
        const cloudinaryConfig = cloudinary.config()
        if (!cloudinaryConfig.cloud_name || uploadError.message?.includes('not configured')) {
          console.warn('Cloudinary not configured, continuing without images')
          // Continue without images instead of failing
          imageUrls = []
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: uploadError.message || 'Failed to upload images to Cloudinary. Please check Cloudinary configuration.'
          })
        }
      }
    } else if (body.images) {
      // Handle images as JSON string or array
      let images: string[] = []
      if (typeof body.images === 'string') {
        try {
          images = JSON.parse(body.images)
        } catch {
          // Not JSON, ignore
        }
      } else if (Array.isArray(body.images)) {
        images = body.images
      }
      imageUrls = images
    }

    const reviewData: CreateReviewReqBody = {
      product_id: body.product_id,
      order_id: body.order_id,
      rating,
      comment: body.comment || undefined,
      images: imageUrls.length > 0 ? imageUrls : undefined
    }

    const reviewId = await reviewsServices.createReview(userId, reviewData)
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Review created successfully',
      data: { review_id: reviewId }
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to create review'
    })
  }
}

export const getProductReviewsController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const { page, limit, sort_by } = req.query

  try {
    // Validate product_id
    if (!product_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product ID is required'
      })
    }

    const result = await reviewsServices.getProductReviews(
      product_id,
      Number(page) || 1,
      Number(limit) || 10,
      (sort_by as 'newest' | 'helpful' | 'rating') || 'newest'
    )

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get product reviews successfully',
      data: result
    })
  } catch (error: any) {
    console.error('Error in getProductReviewsController:', error)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to get reviews'
    })
  }
}

export const updateReviewController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { review_id } = req.params
  const body = req.body as any

  try {
    // Parse rating from string to number if needed
    const rating = body.rating !== undefined 
      ? (typeof body.rating === 'string' ? parseInt(body.rating, 10) : body.rating)
      : undefined

    // Upload images to Cloudinary if files are provided
    let imageUrls: string[] | undefined = undefined
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      try {
        const files = req.files as Express.Multer.File[]
        console.log('Uploading', files.length, 'images to Cloudinary for update...')
        const uploadResults = await cloudinaryService.uploadImages(
          files.map((f) => f.buffer),
          'reviews'
        )
        imageUrls = uploadResults.map((r) => r.secure_url)
        console.log('Upload successful, image URLs:', imageUrls)
      } catch (uploadError: any) {
        console.error('Cloudinary upload error:', uploadError)
        // Check if Cloudinary is not configured
        const cloudinaryConfig = cloudinary.config()
        if (!cloudinaryConfig.cloud_name || uploadError.message?.includes('not configured')) {
          console.warn('Cloudinary not configured, continuing without images')
          // Continue without images instead of failing
          imageUrls = undefined
        } else {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: uploadError.message || 'Failed to upload images to Cloudinary. Please check Cloudinary configuration.'
          })
        }
      }
    } else if (body.images !== undefined) {
      // Handle images as JSON string or array
      let images: string[] = []
      if (typeof body.images === 'string') {
        try {
          images = JSON.parse(body.images)
        } catch {
          // Not JSON, ignore
        }
      } else if (Array.isArray(body.images)) {
        images = body.images
      }
      imageUrls = images.length > 0 ? images : undefined
    }

    const updateData: UpdateReviewReqBody = {
      rating,
      comment: body.comment || undefined,
      images: imageUrls
    }

    await reviewsServices.updateReview(review_id, userId, updateData)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Review updated successfully'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to update review'
    })
  }
}

export const deleteReviewController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { review_id } = req.params

  try {
    await reviewsServices.deleteReview(review_id, userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Review deleted successfully'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to delete review'
    })
  }
}

export const markHelpfulController = async (req: Request, res: Response) => {
  const { review_id } = req.params
  const { helpful } = req.body
  const { userId } = req.decoded_authorization as any

  try {
    const result = await reviewsServices.markHelpful(review_id, userId, helpful === true)
    return res.status(HTTP_STATUS.OK).json({
      message: result.voted ? 'Đã đánh dấu hữu ích' : 'Đã bỏ đánh dấu hữu ích',
      data: {
        voted: result.voted,
        helpful_count: result.helpful_count
      }
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to mark helpful'
    })
  }
}

// Admin controllers
export const getAllReviewsController = async (req: Request, res: Response) => {
  const { page, limit, status, product_id } = req.query

  try {
    const result = await reviewsServices.getAllReviews(
      Number(page) || 1,
      Number(limit) || 20,
      status as any,
      product_id as string
    )

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all reviews successfully',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to get reviews'
    })
  }
}

export const moderateReviewController = async (req: Request, res: Response) => {
  const { review_id } = req.params
  const { status } = req.body

  try {
    await reviewsServices.moderateReview(review_id, status)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Review moderated successfully'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message || 'Failed to moderate review'
    })
  }
}

