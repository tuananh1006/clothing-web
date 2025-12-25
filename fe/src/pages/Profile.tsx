import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useAuth } from '@/hooks/useAuth'
import { getMe, updateMe, uploadAvatar, UpdateUserRequest } from '@/services/users.service'
import { ROUTES } from '@/utils/constants'
import { isValidPhone } from '@/utils/validators'
import Spinner from '@/components/common/Spinner'

// Schema validation cho profile form
const profileSchema = z.object({
  first_name: z.string().min(1, 'Họ không được để trống'),
  last_name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phonenumber: z
    .string()
    .optional()
    .refine((val) => !val || isValidPhone(val), 'Số điện thoại không hợp lệ'),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const Profile = () => {
  const { user: authUser, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // Fetch user data khi component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        // Nếu backend có API /users/me, gọi API
        // Nếu không, sử dụng user từ AuthContext
        let userData = authUser
        try {
          userData = await getMe()
        } catch (err) {
          // Nếu API không tồn tại, sử dụng user từ context
          console.warn('API /users/me không tồn tại, sử dụng user từ context')
        }

        if (userData) {
          // Set form values
          reset({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            phonenumber: userData.phonenumber || '',
            address: userData.address || '',
            date_of_birth: '', // Backend có thể không có field này
          })

          // Set avatar preview
          if (userData.avatar) {
            setAvatarPreview(userData.avatar)
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [authUser, reset])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB')
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Upload avatar nếu có
      let avatarUrl = avatarPreview
      if (avatarFile) {
        try {
          avatarUrl = await uploadAvatar(avatarFile)
        } catch (err) {
          console.error('Lỗi upload avatar:', err)
          // Tiếp tục update profile dù upload avatar thất bại
        }
      }

      // Prepare update data
      const updateData: UpdateUserRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phonenumber: data.phonenumber || undefined,
        address: data.address || undefined,
        date_of_birth: data.date_of_birth && data.date_of_birth.trim() !== '' ? data.date_of_birth : undefined,
        avatar: avatarUrl || undefined,
      }

      // Update user profile
      const updatedUser = await updateMe(updateData)

      // Update AuthContext với user mới
      updateUser(updatedUser)

      setSuccess('Cập nhật thông tin thành công!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-text-sub">Đang tải thông tin...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Thông tin tài khoản', path: ROUTES.PROFILE },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-8">
              Thông tin tài khoản
            </h1>

            <div className="bg-white dark:bg-[#1a2c32] rounded-2xl shadow-lg p-6 md:p-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-gray-400">
                        account_circle
                      </span>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-[#159cc9] transition-colors"
                    aria-label="Upload avatar"
                  >
                    <span className="material-symbols-outlined text-xl">camera_alt</span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <p className="mt-4 text-sm text-text-sub dark:text-gray-400">
                  {authUser?.full_name || 'Người dùng'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Success/Error Messages */}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-lg p-4">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-4">
                    {error}
                  </div>
                )}

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Họ"
                    id="first_name"
                    type="text"
                    placeholder="Nhập họ của bạn"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                  />
                  <Input
                    label="Tên"
                    id="last_name"
                    type="text"
                    placeholder="Nhập tên của bạn"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                  />
                </div>

                {/* Email */}
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  leftIcon={<span className="material-symbols-outlined">mail</span>}
                  {...register('email')}
                  error={errors.email?.message}
                  disabled // Email thường không được thay đổi
                />

                {/* Phone */}
                <Input
                  label="Số điện thoại"
                  id="phonenumber"
                  type="tel"
                  placeholder="0123456789"
                  leftIcon={<span className="material-symbols-outlined">phone</span>}
                  {...register('phonenumber')}
                  error={errors.phonenumber?.message}
                />

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2"
                  >
                    Địa chỉ
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    placeholder="Nhập địa chỉ của bạn"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#111d21] text-text-main dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <Input
                  label="Ngày sinh"
                  id="date_of_birth"
                  type="date"
                  {...register('date_of_birth')}
                  error={errors.date_of_birth?.message}
                />

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" isLoading={isSaving}>
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile
