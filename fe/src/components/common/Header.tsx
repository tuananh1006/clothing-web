import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROUTES } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useTheme } from '@/contexts/ThemeContext'
import { UserRole } from '@/types'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const { toggleTheme } = useTheme()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('search') as string
    if (query) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2c32] px-4 md:px-10 py-4 sticky top-0 z-50"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={ROUTES.HOME} className="flex items-center gap-4 text-text-main dark:text-white">
          <motion.div
            className="size-8 text-primary"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
              fill="currentColor"
            ></path>
            <path
              clipRule="evenodd"
              d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
          </motion.div>
          <motion.h2
            className="text-2xl font-bold leading-tight tracking-[-0.015em] select-none"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            YORI
          </motion.h2>
        </Link>
      </motion.div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-9 flex-1 justify-center">
        {[
          { to: ROUTES.HOME, label: 'Trang chủ' },
          { to: ROUTES.CATEGORIES, label: 'Danh mục' },
          { to: ROUTES.PRODUCTS, label: 'Sản phẩm' },
          { to: ROUTES.ABOUT, label: 'Giới thiệu' },
          { to: ROUTES.CONTACT, label: 'Liên hệ' },
        ].map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={item.to}
              className="text-text-main dark:text-gray-200 hover:text-primary transition-colors text-sm font-medium leading-normal relative"
            >
              <motion.span
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {item.label}
              </motion.span>
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary"
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        ))}
      </nav>

      {/* Icons */}
      <motion.div
        className="flex gap-2 items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Search */}
        <motion.button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors"
          aria-label="Search"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <span className="material-symbols-outlined">search</span>
        </motion.button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          {isAuthenticated ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors"
              aria-label="Account menu"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors"
              aria-label="Account"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          )}

          {/* User Dropdown Menu */}
          {showUserMenu && isAuthenticated && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a2c32] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-text-main dark:text-white">
                  {user?.full_name || user?.email}
                </p>
                <p className="text-xs text-text-sub dark:text-gray-400">{user?.email}</p>
              </div>
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Thông tin tài khoản
              </Link>
              <Link
                to={ROUTES.ORDERS}
                onClick={() => setShowUserMenu(false)}
                className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Đơn hàng của tôi
              </Link>
              {user?.role === UserRole.Admin && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-sm text-text-main dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Quản trị
                </Link>
              )}
              <button
                onClick={async () => {
                  setShowUserMenu(false)
                  await logout()
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link
          to={ROUTES.CART}
          className="flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors relative"
          aria-label="Shopping cart"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {/* Cart badge */}
          {totalItems > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-primary rounded-full border border-white dark:border-background-dark flex items-center justify-center text-[10px] font-bold text-white px-1">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined">dark_mode</span>
            </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors"
          aria-label="Menu"
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </motion.div>

      {/* Search Bar (Mobile/Desktop) */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1a2c32] border-b border-gray-200 dark:border-gray-800 p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              name="search"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111d21] text-text-main dark:text-white focus:ring-2 focus:ring-primary outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors"
            >
              Tìm
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#1a2c32] border-b border-gray-200 dark:border-gray-800 lg:hidden">
          <nav className="flex flex-col p-4 gap-2">
            <Link
              to={ROUTES.HOME}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-text-main dark:text-gray-200 hover:text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to={ROUTES.CATEGORIES}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-text-main dark:text-gray-200 hover:text-primary transition-colors"
            >
              Danh mục
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-text-main dark:text-gray-200 hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              to={ROUTES.ABOUT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-text-main dark:text-gray-200 hover:text-primary transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              to={ROUTES.CONTACT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-text-main dark:text-gray-200 hover:text-primary transition-colors"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
  )
}

export default Header

