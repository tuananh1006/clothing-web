import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { ROUTES } from '@/utils/constants'
import { forgotPassword } from '@/services/auth.service'

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setIsSuccess(false)

    try {
      await forgotPassword({ email: data.email })
      setIsSuccess(true)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Gửi email thất bại. Vui lòng thử lại sau.'
      )
    } finally {
      setIsLoading(false)
    }
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
                  lock_reset
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-text-main dark:text-white">
                Quên mật khẩu?
              </h1>
              <p className="mt-2 text-sm text-text-sub dark:text-gray-400 leading-relaxed">
                Đừng lo lắng, chúng tôi sẽ giúp bạn. Nhập email bạn đã đăng ký để
                nhận hướng dẫn đặt lại mật khẩu.
              </p>
            </div>

            {isSuccess ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                      check_circle
                    </span>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Email đã được gửi!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Vui lòng kiểm tra hộp thư email của bạn để nhận hướng dẫn
                        đặt lại mật khẩu.
                      </p>
                    </div>
                  </div>
                </div>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary" size="lg" className="w-full">
                    Quay lại trang đăng nhập
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="vidu@email.com"
                  leftIcon={<span className="material-symbols-outlined">mail</span>}
                  error={errors.email?.message}
                  {...register('email')}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Gửi mã xác thực
                </Button>
              </form>
            )}

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
          <p className="text-center text-xs text-text-sub dark:text-gray-500">
            Cần thêm sự trợ giúp?{' '}
            <Link
              to={ROUTES.CONTACT}
              className="font-medium text-primary hover:text-primary/80"
            >
              Liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ForgotPassword
