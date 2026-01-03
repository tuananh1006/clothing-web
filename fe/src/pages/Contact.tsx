import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useToast } from '@/contexts/ToastContext'
import * as contactService from '@/services/contact.service'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên của bạn'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Vui lòng nhập chủ đề').optional(),
  message: z.string().min(10, 'Vui lòng nhập ít nhất 10 ký tự'),
})

type ContactFormData = z.infer<typeof contactSchema>

const Contact = () => {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { showError, showSuccess } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true)
    setSuccess(false)
    try {
      await contactService.submitContact(data)
      setSuccess(true)
      showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.')
      reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (error: any) {
      console.error('Failed to submit contact:', error)
      showError(error.response?.data?.message || 'Gửi tin nhắn thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-background-light dark:bg-[#1a2c32] py-16 px-4 lg:px-40 text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-3 tracking-tight">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-text-sub dark:text-gray-400 text-lg">
              Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp và thắc mắc của bạn.
            </p>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 lg:px-40 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6">
                Thông tin liên lạc
              </h2>
              <p className="text-text-sub dark:text-gray-400 mb-10 leading-relaxed text-base">
                YORI đề cao sự kết nối chân thành. Cho dù bạn có câu hỏi về sản phẩm, đơn hàng hay chỉ muốn chia sẻ cảm nhận, đừng ngần ngại liên hệ.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-background-light dark:bg-[#1a2c32] rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main dark:text-white text-lg mb-1">Cửa hàng</h3>
                    <p className="text-text-sub dark:text-gray-400 leading-relaxed">
                      123 Đường Nguyễn Huệ, Quận 1,<br />
                      TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-background-light dark:bg-[#1a2c32] rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main dark:text-white text-lg mb-1">Điện thoại</h3>
                    <p className="text-text-sub dark:text-gray-400">090 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-background-light dark:bg-[#1a2c32] rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main dark:text-white text-lg mb-1">Email</h3>
                    <p className="text-text-sub dark:text-gray-400">hello@yori.vn</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-text-main dark:text-white mb-4">Theo dõi chúng tôi</p>
                <div className="flex gap-4">
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-text-main dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300">
                    <span className="material-symbols-outlined">public</span>
                  </a>
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-text-main dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300">
                    <span className="material-symbols-outlined">alternate_email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6">
                Gửi tin nhắn
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 text-sm">
                    Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Họ và tên"
                  type="text"
                  {...register('name')}
                  error={errors.name?.message}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  required
                />

                <Input
                  label="Số điện thoại (tùy chọn)"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                />

                <Input
                  label="Chủ đề (tùy chọn)"
                  type="text"
                  {...register('subject')}
                  error={errors.subject?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                    Tin nhắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111d21] px-4 py-3 text-base text-text-main dark:text-white placeholder:text-text-sub dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" isLoading={submitting} className="w-full">
                  Gửi tin nhắn
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Contact
