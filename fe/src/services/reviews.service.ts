import api from './api'
import type { ProductReviewsResponse, CreateReviewData, UpdateReviewData, Review } from '@/types/review.types'
import type { ApiResponse } from '@/types/api.types'

/**
 * Lấy reviews của một sản phẩm
 */
export const getProductReviews = async (
  product_id: string,
  page: number = 1,
  limit: number = 10,
  sort_by: 'newest' | 'helpful' | 'rating' = 'newest'
): Promise<ProductReviewsResponse> => {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())
    queryParams.append('sort_by', sort_by)

    const response = await api.get<ApiResponse<ProductReviewsResponse>>(
      `/reviews/products/${product_id}/reviews?${queryParams.toString()}`
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Tạo review mới
 */
export const createReview = async (
  data: CreateReviewData,
  imageFiles?: File[]
): Promise<{ review_id: string }> => {
  try {
    const formData = new FormData()
    formData.append('product_id', data.product_id)
    if (data.order_id) formData.append('order_id', data.order_id)
    formData.append('rating', data.rating.toString())
    if (data.comment) formData.append('comment', data.comment)

    // Append image files if provided
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file)
      })
    } else if (data.images && data.images.length > 0) {
      // Fallback to URLs if no files
      formData.append('images', JSON.stringify(data.images))
    }

    // Không set Content-Type header, axios sẽ tự động set với boundary cho FormData
    const response = await api.post<ApiResponse<{ review_id: string }>>('/reviews', formData)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Update review
 */
export const updateReview = async (
  review_id: string,
  data: UpdateReviewData,
  imageFiles?: File[]
): Promise<void> => {
  try {
    const formData = new FormData()
    if (data.rating !== undefined) formData.append('rating', data.rating.toString())
    if (data.comment !== undefined) formData.append('comment', data.comment)

    // Append image files if provided
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file)
      })
    } else if (data.images !== undefined) {
      // Fallback to URLs if no files
      formData.append('images', JSON.stringify(data.images))
    }

    // Không set Content-Type header, axios sẽ tự động set với boundary cho FormData
    await api.put(`/reviews/${review_id}`, formData)
  } catch (error: any) {
    throw error
  }
}

/**
 * Xóa review
 */
export const deleteReview = async (review_id: string): Promise<void> => {
  try {
    await api.delete(`/reviews/${review_id}`)
  } catch (error: any) {
    throw error
  }
}

/**
 * Mark review as helpful
 */
export const markHelpful = async (review_id: string, helpful: boolean): Promise<ApiResponse<{ voted: boolean; helpful_count: number }>> => {
  try {
    const response = await api.post<ApiResponse<{ voted: boolean; helpful_count: number }>>(`/reviews/${review_id}/helpful`, { helpful })
    return response.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin: Get all reviews với pagination và filters
 */
export interface GetAllReviewsParams {
  page?: number
  limit?: number
  status?: 'pending' | 'approved' | 'rejected'
  product_id?: string
}

export interface AdminReviewsResponse {
  reviews: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
}

export const getAllReviews = async (params: GetAllReviewsParams = {}): Promise<AdminReviewsResponse> => {
  try {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.product_id) queryParams.append('product_id', params.product_id)

    const response = await api.get<ApiResponse<AdminReviewsResponse>>(
      `/reviews/admin/all?${queryParams.toString()}`
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin: Moderate review (approve/reject)
 */
export const moderateReview = async (review_id: string, status: 'approved' | 'rejected'): Promise<void> => {
  try {
    await api.put(`/reviews/admin/${review_id}/moderate`, { status })
  } catch (error: any) {
    throw error
  }
}

