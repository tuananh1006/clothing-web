import api from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse } from '@/types/api.types'

export interface Coupon {
  _id: string
  code: string
  name?: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  used_count?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
  applicable_to?: 'all' | 'specific_categories' | 'specific_products'
  categories?: string[]
  products?: string[]
  calculated_discount?: number // Discount amount được tính toán cho order value hiện tại
}

/**
 * Lấy danh sách mã giảm giá có sẵn
 * Backend endpoint: GET /coupons/available
 * @param orderValue - Giá trị đơn hàng (optional)
 */
export const getAvailableCoupons = async (orderValue?: number): Promise<Coupon[]> => {
  try {
    const queryParams = new URLSearchParams()
    if (orderValue) {
      queryParams.append('order_value', orderValue.toString())
    }

    const queryString = queryParams.toString()
    const url = `${API_ENDPOINTS.COUPONS.AVAILABLE}${queryString ? `?${queryString}` : ''}`

    const response = await api.get<ApiResponse<Coupon[]>>(url)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Validate mã giảm giá
 * Backend endpoint: POST /coupons/validate
 */
export const validateCoupon = async (
  code: string,
  orderValue: number,
  productIds?: string[],
  categoryIds?: string[]
): Promise<{ valid: boolean; coupon?: Coupon; discountAmount?: number; message?: string }> => {
  try {
    const response = await api.post<ApiResponse<{ valid: boolean; coupon?: Coupon; discountAmount?: number }>>(
      API_ENDPOINTS.COUPONS.VALIDATE,
      {
        code,
        order_value: orderValue,
        product_ids: productIds,
        category_ids: categoryIds
      }
    )
    return {
      valid: true,
      coupon: response.data.data.coupon,
      discountAmount: response.data.data.discountAmount
    }
  } catch (error: any) {
    return {
      valid: false,
      message: error.response?.data?.message || 'Mã giảm giá không hợp lệ'
    }
  }
}

