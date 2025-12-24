import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { ROUTES } from '@/utils/constants'
import { resetPassword, verifyForgotPasswordToken } from '@/services/auth.service'
import { isValidPassword } from '@/utils/validators'

// Validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .refine(
        (val) => isValidPassword(val),
        'Mật khẩu phải có ít nhất 1 chữ cái và 1 số'
      ),
    password_confirmation: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    email: z.string().email('Email không hợp lệ'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Mật khẩu không khớp',
    path: ['password_confirmation'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
    },
  })

  // Verify token khi component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token không hợp lệ. Vui lòng kiểm tra lại link.')
        setIsVerifying(false)
        return
      }

      try {
        await verifyForgotPasswordToken({ forgot_password_token: token })
        setIsVerifying(false)
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.'
        )
        setIsVerifying(false)
      }
    }

    verifyToken()
    if (email) {
      setValue('email', email)
    }
  }, [token, email, setValue])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Token không hợp lệ')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await resetPassword({
        token,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })
      setIsSuccess(true)

      // Redirect to login sau 3 giây
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 3000)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Đặt lại mật khẩu thất bại. Vui lòng thử lại.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text-sub">Đang xác thực token...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-[#1a2c32] px-6 py-10 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-800 text-center">
              <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">
                  check_circle
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                Đặt lại mật khẩu thành công!
              </h1>
              <p className="text-sm text-text-sub dark:text-gray-400 mb-6">
                Mật khẩu của bạn đã được đặt lại. Bạn sẽ được chuyển đến trang đăng
                nhập trong giây lát...
              </p>
              <Link to={ROUTES.LOGIN}>
                <Button variant="primary" size="lg" className="w-full">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white dark:bg-[#1a2c32] px-6 py-10 shadow-sm sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-gray-800">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-3xl text-primary">
                  lock
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">
                Đặt lại mật khẩu
              </h1>
              <p className="mt-2 text-sm text-text-sub dark:text-gray-400 leading-relaxed">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Email (hidden nếu đã có từ URL) */}
              {!email && (
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  leftIcon={<span className="material-symbols-outlined">mail</span>}
                  error={errors.email?.message}
                  {...register('email')}
                />
              )}

              {/* New Password */}
              <Input
                label="Mật khẩu mới"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tối thiểu 8 ký tự"
                leftIcon={<span className="material-symbols-outlined">lock</span>}
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
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Confirm Password */}
              <Input
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                leftIcon={<span className="material-symbols-outlined">lock</span>}
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
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Đặt lại mật khẩu
              </Button>
            </form>

            <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="flex items-center gap-2 text-sm font-medium text-text-sub dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors group"
                >
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
                    arrow_back
                  </span>
                  Quay lại trang đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ResetPassword
