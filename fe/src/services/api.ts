import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getToken, getRefreshToken, clearTokens } from '@/utils/storage'

// Tạo Axios instance với baseURL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

// Log để debug
console.log('API Base URL:', baseURL)
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL)

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000, // Tăng timeout lên 30s cho các request có thể mất thời gian
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Thêm token vào header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Nếu là FormData, không set Content-Type để browser tự set với boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    // Log request để debug
    const url = config.url || ''
    const baseURL = config.baseURL || ''
    console.log('API Request:', config.method?.toUpperCase(), url, baseURL + url)
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Flag để tránh vòng lặp vô hạn khi refresh token
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful response để debug
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status)
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Log error để debug
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data,
    })

    // Handle 401 Unauthorized - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Nếu đang refresh token hoặc request là refresh token endpoint, không retry
      if (originalRequest.url?.includes('/refresh-token') || originalRequest.url?.includes('/login')) {
        clearTokens()
        localStorage.removeItem('user')
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/signup') {
          window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`
        }
        return Promise.reject(error)
      }

      // Nếu đang refresh, thêm request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refresh_token = getRefreshToken()

      if (!refresh_token) {
        // Không có refresh token, logout
        clearTokens()
        localStorage.removeItem('user')
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/signup') {
          window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`
        }
        processQueue(error, null)
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        // Gọi refresh token API (không dùng interceptor để tránh vòng lặp)
        const { refreshToken } = await import('@/services/auth.service')
        const response = await refreshToken()
        const newAccessToken = response.access_token

        // Cập nhật token trong request ban đầu
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        // Process queue với token mới
        processQueue(null, newAccessToken)
        isRefreshing = false

        // Retry request ban đầu
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token thất bại, logout
        processQueue(refreshError, null)
        isRefreshing = false
        clearTokens()
        localStorage.removeItem('user')
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/signup') {
          window.location.href = `/login?returnUrl=${encodeURIComponent(currentPath)}`
        }
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden - Không có quyền truy cập
    if (error.response?.status === 403) {
      // Có thể redirect hoặc hiển thị thông báo
      console.error('Access denied')
      // Redirect to home nếu không phải admin
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/'
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api

