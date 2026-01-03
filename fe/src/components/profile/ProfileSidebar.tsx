import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/Button'

interface ProfileSidebarProps {
  currentView: 'info' | 'password'
  onViewChange: (view: 'info' | 'password') => void
}

const ProfileSidebar = ({ currentView, onViewChange }: ProfileSidebarProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const accountLabel =
    user?.role === 'admin' ? 'Tài khoản admin' : 'Tài khoản người dùng'

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-4xl text-gray-400 flex items-center justify-center h-full">
                account_circle
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-text-main dark:text-white">
              {user?.full_name || 'Người dùng'}
            </p>
            <p className="text-sm text-text-sub dark:text-gray-400">
              {accountLabel}
            </p>
          </div>
        </div>

        {/* Divider dưới avatar */}
        <div className="border-b border-gray-200 dark:border-gray-700" />

        {/* Menu */}
        <nav className="space-y-1">
          {/* Thông tin cá nhân */}
          <button
            onClick={() => onViewChange('info')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors
              ${
                currentView === 'info'
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <span className="material-symbols-outlined text-lg">
              person
            </span>
            Thông tin cá nhân
          </button>

          {/* Đổi mật khẩu */}
          <button
            onClick={() => onViewChange('password')}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors
              ${
                currentView === 'password'
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <span className="material-symbols-outlined text-lg">
              vpn_key
            </span>
            Đổi mật khẩu
          </button>

          {/* Đơn hàng */}
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              transition-colors
              ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `
            }
          >
            <span className="material-symbols-outlined text-lg">
              receipt_long
            </span>
            Đơn hàng
          </NavLink>
        </nav>

        {/* Divider trên đăng xuất */}
        <div className="border-b border-gray-200 dark:border-gray-700" />

        {/* Đăng xuất */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            text-red-600 dark:text-red-500
            hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors
          "
        >
          <span className="material-symbols-outlined text-lg">
            logout
          </span>
          Đăng xuất
        </button>
      </div>

      {/* Logout confirmation dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#1a2c32] rounded-2xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-text-main dark:text-white">
              Xác nhận đăng xuất
            </h3>
            <p className="mt-2 text-sm text-text-sub dark:text-gray-400">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
                className="text-text-main dark:text-white border-gray-300 dark:border-gray-600"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileSidebar