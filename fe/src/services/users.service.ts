import api from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import type { User } from '@/types'
import type { ApiResponse } from '@/types/api.types'

/**
 * Interface cho update user request
 */
export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  email?: string
  phonenumber?: string
  address?: string
  date_of_birth?: string
  avatar?: string
}

/**
 * Interface cho change password request
 */
export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  password_confirmation: string
}

/**
 * Lấy thông tin user hiện tại
 * Backend endpoint: GET /users/me
 */
export const getMe = async (): Promise<User> => {
  try {
    const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.USERS.ME)
    const backendUser = response.data.data

    // Map user data từ backend response
    const user: User = {
      _id: backendUser._id || backendUser.id || '',
      first_name: backendUser.first_name || '',
      last_name: backendUser.last_name || '',
      full_name: backendUser.full_name || `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim(),
      email: backendUser.email,
      role: backendUser.role || 'customer',
      avatar: backendUser.avatar || backendUser.avatar_url,
      address: backendUser.address,
      phonenumber: backendUser.phonenumber || backendUser.phone,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    }

    return user
  } catch (error: any) {
    throw error
  }
}

/**
 * Cập nhật thông tin user
 * Backend endpoint: PATCH /users/me
 */
export const updateMe = async (data: UpdateUserRequest): Promise<User> => {
  try {
    const response = await api.patch<ApiResponse<any>>(API_ENDPOINTS.USERS.ME, data)
    const backendUser = response.data.data

    // Map user data từ backend response
    const user: User = {
      _id: backendUser._id || backendUser.id || '',
      first_name: backendUser.first_name || '',
      last_name: backendUser.last_name || '',
      full_name: backendUser.full_name || `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim(),
      email: backendUser.email,
      role: backendUser.role || 'customer',
      avatar: backendUser.avatar || backendUser.avatar_url,
      address: backendUser.address,
      phonenumber: backendUser.phonenumber || backendUser.phone,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    }

    return user
  } catch (error: any) {
    throw error
  }
}

/**
 * Upload avatar
 * Backend endpoint: POST /users/me/avatar
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post<ApiResponse<{ avatar_url: string }>>(
      API_ENDPOINTS.USERS.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.data.avatar_url || ''
  } catch (error: any) {
    throw error
  }
}


/**
 * Đổi mật khẩu
 * Backend endpoint: PATCH /users/me/password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  try {
    await api.patch<ApiResponse<void>>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, data)
  } catch (error: any) {
    throw error
  }
}