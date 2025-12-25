import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { ROUTES } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { socialLogin } from '@/services/auth.service'
import type { LoginRequest, SocialLoginRequest } from '@/types'

// Validation schema với Zod
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  remember_me: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showError, showSuccess } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember_me: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Normalize data trước khi gửi
      const loginData: LoginRequest = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
        remember_me: data.remember_me || false,
      }

      console.log('[Login] Login data:', { ...loginData, password: '***' })

      await login(loginData)

      // Hiển thị toast success
      showSuccess('Đăng nhập thành công!')

      // Redirect về trang chủ hoặc trang trước đó
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl')
      navigate(returnUrl || ROUTES.HOME)
    } catch (err: any) {
      console.error('Login error:', err.response?.data)
      
      // Lấy error message
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.'
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.map((e: any) => e.message || e.msg).join(', ')
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      // Hiển thị toast error
      showError(errorMessage)
      
      // Cũng set error state để hiển thị trong form (nếu cần)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement social login với OAuth provider
      // Hiện tại chỉ là placeholder
      const token = '' // Token từ OAuth provider
      const socialData: SocialLoginRequest = {
        provider,
        token,
      }

      await socialLogin(socialData)
      navigate(ROUTES.HOME)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        `Đăng nhập bằng ${provider === 'google' ? 'Google' : 'Facebook'} thất bại.`
      showError(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow w-full flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-[1000px] bg-white dark:bg-[#1a2c32] rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row min-h-[600px]">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2 tracking-tight">
                Chào mừng trở lại
              </h1>
              <p className="text-text-sub dark:text-gray-400 text-sm">
                Vui lòng nhập thông tin đăng nhập của bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <Input
                label="Email"
                type="email"
                placeholder="name@example.com"
                leftIcon={<span className="material-symbols-outlined">mail</span>}
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password Input */}
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                leftIcon={<span className="material-symbols-outlined">lock</span>}
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-[#111d21]"
                    {...register('remember_me')}
                  />
                  <span className="text-xs text-text-sub dark:text-gray-400">
                    Ghi nhớ đăng nhập
                  </span>
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-xs font-medium text-primary hover:text-[#159cc9] transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-4"
              >
                Đăng nhập
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 dark:border-gray-700 w-full absolute"></div>
                <span className="bg-white dark:bg-[#1a2c32] px-3 text-xs text-gray-400 relative z-10">
                  Hoặc đăng nhập với
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#FFC107"
                    ></path>
                    <path
                      d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z"
                      fill="#FF3D00"
                    ></path>
                    <path
                      d="M12 22C14.666 22 17.0545 20.9455 18.841 19.2945L15.698 16.643C14.654 17.4725 13.3855 18 12 18C9.362 18 7.1285 16.2995 6.295 13.9855L3.109 16.437C4.7865 19.7045 8.1395 22 12 22Z"
                      fill="#4CAF50"
                    ></path>
                    <path
                      d="M22 12C22 11.3295 21.931 10.675 21.8055 10.0415H12V14H17.6515C17.257 15.108 16.545 16.036 15.698 16.643L18.841 19.2945C20.725 17.552 21.868 15.011 22 12Z"
                      fill="#1976D2"
                    ></path>
                  </svg>
                  <span className="text-sm font-medium text-text-main dark:text-gray-200">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  <span className="text-sm font-medium text-text-main dark:text-gray-200">
                    Facebook
                  </span>
                </button>
              </div>
              <p className="text-center text-sm text-text-sub dark:text-gray-400 mt-4">
                Chưa có tài khoản?{' '}
                <Link
                  to={ROUTES.SIGNUP}
                  className="text-primary font-bold hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden md:block w-1/2 relative bg-gray-100 dark:bg-gray-800">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY")',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <h2 className="text-3xl font-bold mb-3 leading-tight">
                Phong cách tối giản,<br />
                Cuộc sống cân bằng.
              </h2>
              <p className="text-white/80 text-sm font-light">
                Khám phá bộ sưu tập mới nhất với ưu đãi dành riêng cho thành viên YORI.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
