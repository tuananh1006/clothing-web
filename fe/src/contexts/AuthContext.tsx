import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginService, register as registerService, logout as logoutService } from '@/services/auth.service'
import { getToken, clearTokens } from '@/utils/storage'
import type { User, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/types'
import { ROUTES } from '@/utils/constants'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()
      
      if (!token) {
        setIsLoading(false)
        return
      }

      // TODO: Nếu backend có API /users/me, gọi API để lấy user info
      // Hiện tại, user info được lưu trong token hoặc từ login response
      // Tạm thời set user từ localStorage nếu có
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Error parsing stored user:', error)
          clearTokens()
          localStorage.removeItem('user')
        }
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response: LoginResponse = await loginService(data)
      setUser(response.user)
      // Lưu user vào localStorage để persist
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response: RegisterResponse = await registerService(data)
      setUser(response.user)
      // Lưu user vào localStorage để persist
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      clearTokens()
      localStorage.removeItem('user')
      navigate(ROUTES.LOGIN)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

