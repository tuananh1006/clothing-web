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
import { getMe, updateMe, uploadAvatar, changePassword, UpdateUserRequest, ChangePasswordRequest } from '@/services/users.service'
import { ROUTES } from '@/utils/constants'
import { isValidPhone, isValidPassword } from '@/utils/validators'
import Spinner from '@/components/common/Spinner'
import { useToast } from '@/contexts/ToastContext'
import ProfileSidebar from '@/components/profile/ProfileSidebar'

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

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  new_password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .refine(
      (val) => isValidPassword(val),
      'Mật khẩu phải có ít nhất 1 chữ cái và 1 số'
    ),
  password_confirmation: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.new_password === data.password_confirmation, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['password_confirmation'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

const Profile = () => {
  const { user: authUser, updateUser } = useAuth()
  const { showSuccess, showError } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentView, setCurrentView] = useState<'info' | 'password'>('info')

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        let userData = authUser

        try {
          userData = await getMe()
        } catch {
          console.warn('Không có API /users/me, dùng user từ context')
        }

        if (userData) {
          resetProfile({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            phonenumber: userData.phonenumber || '',
            address: userData.address || '',
            date_of_birth: '',
          })

          if (userData.avatar) {
            setAvatarPreview(userData.avatar)
          }
        }
      } catch (err: any) {
        showError(err.response?.data?.message || 'Không thể tải thông tin người dùng')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [authUser, resetProfile])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showError('Vui lòng chọn file ảnh')
      return
    }

    if (file.size > 1 * 1024 * 1024) {
      showError('Kích thước ảnh không được vượt quá 1MB')
      return
    }

    try {
      const avatarUrl = await uploadAvatar(file)
      setAvatarPreview(avatarUrl)

      if (authUser) {
        updateUser({
          ...authUser,
          avatar: avatarUrl,
        })
      }

      showSuccess('Cập nhật ảnh đại diện thành công!')
    } catch {
      showError('Upload ảnh đại diện thất bại')
    }
  }

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsSaving(true)

    try {
      const updateData: UpdateUserRequest = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phonenumber: data.phonenumber || undefined,
        address: data.address || undefined,
        date_of_birth: data.date_of_birth || undefined,
      }

      const updatedUser = await updateMe(updateData)
      updateUser(updatedUser)
      showSuccess('Cập nhật thông tin thành công!')
    } catch (err: any) {
      showError(err.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setIsSaving(false)
    }
  }

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    setIsChangingPassword(true)

    try {
      const passwordData: ChangePasswordRequest = {
        current_password: data.current_password,
        new_password: data.new_password,
        password_confirmation: data.password_confirmation,
      }

      await changePassword(passwordData)
      showSuccess('Đổi mật khẩu thành công!')
      resetPassword()
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (err: any) {
      showError(err.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Thông tin tài khoản', path: ROUTES.PROFILE },
            ]}
          />

          <h1 className="text-3xl font-bold text-text-main dark:text-white mb-8 mt-6">
            Thông tin tài khoản
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ProfileSidebar 
                currentView={currentView}
                onViewChange={setCurrentView}
              />
            </div>

            <div className="lg:col-span-3">
              {/* Profile Information View */}
              {currentView === 'info' && (
                <div className="bg-white dark:bg-[#1a2c32] rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                    Thông tin cá nhân
                  </h2>

                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {avatarPreview ? (
                          <img src={avatarPreview} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                          <span className="material-symbols-outlined text-6xl text-gray-400">
                            account_circle
                          </span>
                        )}
                      </div>

                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full cursor-pointer shadow-md hover:bg-[#159cc9] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl leading-none">
                          camera_alt
                        </span>
                      </label>

                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div className="mt-4 text-center text-xs text-text-sub dark:text-gray-400 space-y-1">
                      <p>Dung lượng file tối đa 1 MB</p>
                      <p>Định dạng: .JPEG, .PNG</p>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Họ" {...registerProfile('first_name')} error={profileErrors.first_name?.message} />
                      <Input label="Tên" {...registerProfile('last_name')} error={profileErrors.last_name?.message} />
                    </div>

                    <Input label="Email" disabled {...registerProfile('email')} />
                    <Input label="Số điện thoại" {...registerProfile('phonenumber')} />

                    <div>
                      <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2">
                        Địa chỉ
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111d21] text-text-main dark:text-white text-sm hover:border-primary/50 focus:ring-2 focus:ring-primary focus:border-transparent focus:scale-[1.01] outline-none transition-all duration-300"
                        {...registerProfile('address')}
                      />
                    </div>

                    <Input label="Ngày sinh" type="date" {...registerProfile('date_of_birth')} />

                    <div className="flex justify-center pt-4">
                      <Button type="submit" isLoading={isSaving}>
                        Lưu thay đổi
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Change Password View */}
              {currentView === 'password' && (
                <div className="bg-white dark:bg-[#1a2c32] rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                    Đổi mật khẩu
                  </h2>

                  <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                    <Input
                      label="Mật khẩu hiện tại"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...registerPassword('current_password')}
                      error={passwordErrors.current_password?.message}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showCurrentPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      }
                    />

                    <Input
                      label="Mật khẩu mới"
                      type={showNewPassword ? 'text' : 'password'}
                      {...registerPassword('new_password')}
                      error={passwordErrors.new_password?.message}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showNewPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      }
                    />

                    <Input
                      label="Xác nhận mật khẩu mới"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerPassword('password_confirmation')}
                      error={passwordErrors.password_confirmation?.message}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      }
                    />

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                        Yêu cầu mật khẩu:
                      </p>
                      <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                        <li>Ít nhất 8 ký tự</li>
                        <li>Có ít nhất 1 chữ cái (A-Z hoặc a-z)</li>
                        <li>Có ít nhất 1 chữ số (0-9)</li>
                      </ul>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button type="submit" isLoading={isChangingPassword}>
                        Đổi mật khẩu
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Profile