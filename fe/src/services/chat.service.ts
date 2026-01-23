import api from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse } from '@/types/api.types'

export interface ChatMessage {
  _id: string
  sender_id: string
  sender_role: 'customer' | 'admin'
  message: string
  created_at: string
  read?: boolean
}

export interface Chat {
  _id: string
  user_id: string
  admin_id?: string
  status: 'open' | 'closed' | 'pending'
  messages: ChatMessage[]
  user?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

/**
 * Lấy hoặc tạo chat
 */
export const getOrCreateChat = async (): Promise<Chat> => {
  const response = await api.get<ApiResponse<Chat>>(API_ENDPOINTS.CHAT.GET_OR_CREATE)
  return response.data.data
}

/**
 * Gửi tin nhắn
 */
export const sendMessage = async (message: string): Promise<ChatMessage> => {
  const response = await api.post<ApiResponse<ChatMessage>>(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
    message
  })
  return response.data.data
}

/**
 * Lấy danh sách tin nhắn
 */
export const getMessages = async (): Promise<ChatMessage[]> => {
  const response = await api.get<ApiResponse<ChatMessage[]>>(API_ENDPOINTS.CHAT.GET_MESSAGES)
  return response.data.data
}

/**
 * Đóng chat
 */
export const closeChat = async (): Promise<void> => {
  await api.post(API_ENDPOINTS.CHAT.CLOSE)
}

