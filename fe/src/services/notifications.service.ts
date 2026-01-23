import api from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse } from '@/types/api.types'

export interface Notification {
  _id: string
  user_id: string
  type: 'order_status_update' | 'order_placed' | 'order_cancelled' | 'new_coupon' | 'order_shipped' | 'order_delivered' | 'review_rejected' | 'account_banned' | 'general'
  title: string
  message: string
  data?: {
    order_id?: string
    order_code?: string
    coupon_id?: string
    coupon_code?: string
    [key: string]: any
  }
  read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

export interface NotificationsResponse {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
}

/**
 * Lấy danh sách notifications của user
 */
export const getNotifications = async (params?: {
  page?: number
  limit?: number
  read?: boolean
}): Promise<NotificationsResponse> => {
  try {
    const response = await api.get<ApiResponse<NotificationsResponse>>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
      params
    })
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy số notifications chưa đọc
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await api.get<ApiResponse<{ count: number }>>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT)
    return response.data.data.count
  } catch (error: any) {
    throw error
  }
}

/**
 * Đánh dấu notification là đã đọc
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId))
  } catch (error: any) {
    throw error
  }
}

/**
 * Đánh dấu tất cả notifications là đã đọc
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
  } catch (error: any) {
    throw error
  }
}

/**
 * Xóa notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId))
  } catch (error: any) {
    throw error
  }
}

