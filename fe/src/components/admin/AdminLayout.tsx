import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toggleTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { path: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard', label: 'Tổng quan' },
    { path: ROUTES.ADMIN_PRODUCTS, icon: 'shopping_bag', label: 'Sản phẩm' },
    { path: ROUTES.ADMIN_ORDERS, icon: 'receipt_long', label: 'Đơn hàng' },
    { path: ROUTES.ADMIN_CUSTOMERS, icon: 'group', label: 'Khách hàng' },
    { path: ROUTES.ADMIN_REVIEWS, icon: 'rate_review', label: 'Đánh giá' },
    { path: ROUTES.ADMIN_SETTINGS, icon: 'settings', label: 'Cài đặt' },
  ]

  const isActive = (path: string) => {
    if (path === ROUTES.ADMIN_DASHBOARD) {
      return location.pathname === ROUTES.ADMIN || location.pathname === ROUTES.ADMIN_DASHBOARD
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200 font-display overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white dark:bg-[#1a2c32] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-200 flex-shrink-0 z-20 overflow-hidden`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="size-8 text-primary mr-3">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">YORI Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-text-main dark:hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User section */}
          <div className="mt-8 px-6 text-xs font-semibold text-text-sub uppercase tracking-wider mb-2">
            Hệ thống
          </div>
          <ul className="space-y-1 px-3">
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-text-main dark:hover:text-white rounded-lg font-medium transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            </li>
          </ul>
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img alt={user.full_name || 'Admin'} className="w-full h-full object-cover" src={user.avatar} />
              ) : (
                <span className="material-symbols-outlined text-gray-500">account_circle</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-main dark:text-white">
                {user?.full_name || 'Admin'}
              </span>
              <span className="text-xs text-text-sub">Quản trị viên</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top header */}
        <header className="h-16 bg-white dark:bg-[#1a2c32] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="relative w-96 hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-none text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 placeholder-gray-400"
                placeholder="Tìm kiếm báo cáo, dữ liệu..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <button className="relative p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-[#1a2c32]"></span>
            </button>
            <Link
              to={ROUTES.HOME}
              className="p-2 text-text-sub hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Về trang chủ"
            >
              <span className="material-symbols-outlined">home</span>
            </Link>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout

