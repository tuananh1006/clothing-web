import api from './api'
import { API_ENDPOINTS, PAGINATION } from '@/utils/constants'
import type { ApiResponse, Order, OrderFilters } from '@/types'

/**
 * Interface cho orders list response
 */
export interface GetOrdersResponse {
  items: Order[]
  pagination: {
    page: number
    limit: number
    total_page: number
    total: number
  }
}

/**
 * Lấy danh sách orders với filters
 * Backend endpoint: GET /orders
 */
export const getOrders = async (filters: OrderFilters = {}): Promise<GetOrdersResponse> => {
  try {
    const params = {
      page: filters.page || PAGINATION.DEFAULT_PAGE,
      limit: filters.limit || PAGINATION.DEFAULT_LIMIT,
      ...(filters.keyword && { keyword: filters.keyword }),
      ...(filters.status && { status: filters.status }),
      ...(filters.start_date && { start_date: filters.start_date }),
      ...(filters.end_date && { end_date: filters.end_date }),
    }
    const response = await api.get<ApiResponse<GetOrdersResponse>>(API_ENDPOINTS.ORDERS.LIST, {
      params,
    })
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy chi tiết order theo orderId
 * Backend endpoint: GET /orders/:orderId
 */
export const getOrderDetail = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(orderId))
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Hủy đơn hàng
 * Backend endpoint: PUT /orders/:orderId/cancel
 */
export const cancelOrder = async (orderId: string): Promise<{ message: string; order_id: string }> => {
  try {
    const response = await api.put<ApiResponse<{ message: string; order_id: string }>>(
      API_ENDPOINTS.ORDERS.CANCEL(orderId)
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

