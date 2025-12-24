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
import { register, socialLogin } from '@/services/auth.service'
import type { RegisterRequest, SocialLoginRequest } from '@/types'
import { isValidPassword } from '@/utils/validators'

// Validation schema với Zod
const signupSchema = z
  .object({
    first_name: z.string().min(1, 'Tên là bắt buộc'),
    last_name: z.string().min(1, 'Họ là bắt buộc'),
    email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .refine(
        (val) => isValidPassword(val),
        'Mật khẩu phải có ít nhất 1 chữ cái và 1 số'
      ),
    password_confirmation: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    agree_terms: z.boolean().refine((val) => val === true, {
      message: 'Bạn phải đồng ý với điều khoản sử dụng',
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Mật khẩu không khớp',
    path: ['password_confirmation'],
  })

type SignupFormData = z.infer<typeof signupSchema>

const Signup = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agree_terms: false,
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const registerData: RegisterRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        agree_terms: data.agree_terms,
      }

      await register(registerData)

      // Redirect về trang chủ sau khi đăng ký thành công
      navigate(ROUTES.HOME)
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement social login với OAuth provider
      const token = '' // Token từ OAuth provider
      const socialData: SocialLoginRequest = {
        provider,
        token,
      }

      await socialLogin(socialData)
      navigate(ROUTES.HOME)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Đăng ký bằng ${provider === 'google' ? 'Google' : 'Facebook'} thất bại.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow w-full flex justify-center items-center py-10 px-4">
        <div className="w-full max-w-[960px] bg-white dark:bg-[#1a2c32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Image Section */}
          <div className="w-full md:w-5/12 relative hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB2SKUoOEQliT6zI5_2rUgEFrVSvWQPcD3cjHRFtCDzaVNMXWwVfV94R2o12djBf5mzW4zAzSdCQrMNSnhG1rSlVpMLjiYT_9oc5kLFYFhNPVHpACM-lezQ7UP6jbg_Ixpf6z9gL01Aym8plLHL4kz3dP-gYG_KGANfjTrffUpOZkcf0BabuyLegxJc7uc5Uxn_3xE88nhqgcf3D8gssYbmFxf5t24KiW7uAJlrMuURGJ24TSZpHTgs6j2s-bIZXfbiTq-gGNI1aVo")',
              }}
            ></div>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
              <div className="flex items-center gap-2">
                <div className="size-6 text-white">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <span className="text-lg font-bold">YORI</span>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Gia nhập cộng đồng <br />
                  tối giản
                </h2>
                <p className="text-gray-200 text-sm font-light leading-relaxed">
                  Đăng ký thành viên YORI để nhận ưu đãi đặc biệt, theo dõi đơn hàng
                  dễ dàng và cập nhật xu hướng thời trang mới nhất.
                </p>
              </div>
              <div className="flex gap-2 text-xs text-gray-300">
                <span>© 2024 YORI Inc.</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center md:text-left mb-8">
                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                  Tạo tài khoản mới
                </h1>
                <p className="text-text-sub dark:text-gray-400 text-sm">
                  Bạn đã có tài khoản?{' '}
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-primary hover:underline font-medium"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* First Name & Last Name */}
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <Input
                      label="Tên"
                      type="text"
                      placeholder="Nhập tên"
                      error={errors.first_name?.message}
                      {...register('first_name')}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Họ"
                      type="text"
                      placeholder="Nhập họ"
                      error={errors.last_name?.message}
                      {...register('last_name')}
                    />
                  </div>
                </div>

                {/* Email */}
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                {/* Password */}
                <div>
                  <Input
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 8 ký tự"
                    error={errors.password?.message}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    }
                    {...register('password')}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <Input
                    label="Nhập lại mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    error={errors.password_confirmation?.message}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    }
                    {...register('password_confirmation')}
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-[#152329]"
                      {...register('agree_terms')}
                    />
                  </div>
                  <div className="text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-text-main dark:text-gray-300"
                    >
                      Tôi đồng ý với{' '}
                      <Link to={ROUTES.TERMS} className="text-primary hover:underline">
                        Điều khoản sử dụng
                      </Link>{' '}
                      và{' '}
                      <Link to={ROUTES.TERMS} className="text-primary hover:underline">
                        Chính sách bảo mật
                      </Link>{' '}
                      của YORI.
                    </label>
                    {errors.agree_terms && (
                      <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                        {errors.agree_terms.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-4"
                >
                  Đăng ký tài khoản
                </Button>
              </form>

              {/* Social Login */}
              <div className="mt-8 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <span className="relative bg-white dark:bg-[#1a2c32] px-4 text-xs text-text-sub uppercase tracking-wider">
                  Hoặc đăng ký với
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-transparent text-text-main dark:text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors bg-white dark:bg-transparent text-text-main dark:text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="h-5 w-5 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Signup
