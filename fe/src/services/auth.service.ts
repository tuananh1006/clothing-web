import api from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import { setTokens, clearTokens } from '@/utils/storage'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SocialLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyForgotPasswordTokenRequest,
  ApiResponse,
} from '@/types'
import type { ApiError } from '@/types/api.types'

/**
 * Login với email/username và password
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )
    const { access_token, refresh_token, user: backendUser } = response.data.data

    // Map user data từ backend response (backend trả về { id, name, email, avatar_url, role })
    const user: LoginResponse['user'] = {
      _id: backendUser.id || backendUser._id || '',
      first_name: backendUser.first_name || backendUser.name?.split(' ')[0] || '',
      last_name: backendUser.last_name || backendUser.name?.split(' ').slice(1).join(' ') || '',
      full_name: backendUser.full_name || backendUser.name || '',
      email: backendUser.email,
      role: backendUser.role || 'customer',
      avatar: backendUser.avatar || backendUser.avatar_url,
      address: backendUser.address,
      phonenumber: backendUser.phonenumber,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
    }

    // Lưu tokens vào localStorage
    setTokens(access_token, refresh_token)

    return { access_token, refresh_token, user }
  } catch (error: any) {
    throw error
  }
}

/**
 * Đăng ký tài khoản mới
 */
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post<ApiResponse<any>>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  )
  const { access_token, refresh_token, user: backendUser } = response.data.data

  // Map user data từ backend response (backend trả về { id, email, full_name, role })
  const user: RegisterResponse['user'] = {
    _id: backendUser.id || backendUser._id || '',
    first_name: backendUser.first_name || data.first_name,
    last_name: backendUser.last_name || data.last_name,
    full_name: backendUser.full_name || `${data.first_name} ${data.last_name}`,
    email: backendUser.email || data.email,
    role: backendUser.role || 'customer',
    avatar: backendUser.avatar || backendUser.avatar_url,
    address: backendUser.address,
    phonenumber: backendUser.phonenumber,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
  }

  // Lưu tokens vào localStorage
  setTokens(access_token, refresh_token)

  return { access_token, refresh_token, user }
}

/**
 * Đăng xuất
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT)
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Xóa tokens dù API có thành công hay không
    clearTokens()
  }
}

/**
 * Đăng nhập bằng social (Google/Facebook)
 */
export const socialLogin = async (
  data: SocialLoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<any>>(
    API_ENDPOINTS.AUTH.SOCIAL_LOGIN,
    data
  )
  const { access_token, refresh_token, user: backendUser } = response.data.data

  // Map user data từ backend response
  const user: LoginResponse['user'] = {
    _id: backendUser.id || backendUser._id || '',
    first_name: backendUser.first_name || backendUser.name?.split(' ')[0] || '',
    last_name: backendUser.last_name || backendUser.name?.split(' ').slice(1).join(' ') || '',
    full_name: backendUser.full_name || backendUser.name || '',
    email: backendUser.email,
    role: backendUser.role || 'customer',
    avatar: backendUser.avatar || backendUser.avatar_url,
    address: backendUser.address,
    phonenumber: backendUser.phonenumber,
    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
  }

  // Lưu tokens vào localStorage
  setTokens(access_token, refresh_token)

  return { access_token, refresh_token, user }
}

/**
 * Quên mật khẩu
 */
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data)
}

/**
 * Đặt lại mật khẩu
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
}

/**
 * Verify forgot password token
 */
export const verifyForgotPasswordToken = async (
  data: VerifyForgotPasswordTokenRequest
): Promise<void> => {
  await api.post(API_ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD, data)
}

