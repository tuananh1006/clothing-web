import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0e181b] border-t border-gray-100 dark:border-gray-800">
      <div className="px-4 md:px-10 lg:px-40 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-[1200px] mx-auto">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              <div className="size-6 text-primary">
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
              <h2 className="text-xl font-bold tracking-tight">YORI</h2>
            </div>
            <p className="text-text-sub dark:text-gray-500 text-sm leading-relaxed">
              Thời trang bền vững mang phong cách Nhật Bản. Tối giản trong thiết kế,
              tỉ mỉ trong từng đường kim mũi chỉ.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                className="text-text-sub dark:text-gray-500 hover:text-primary transition-colors"
                aria-label="Website"
              >
                <span className="material-symbols-outlined">public</span>
              </a>
              <a
                href="#"
                className="text-text-sub dark:text-gray-500 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-text-main dark:text-white font-bold text-base">
              Liên kết nhanh
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.ABOUT}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Về chúng tôi
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Bộ sưu tập
              </Link>
              <Link
                to={ROUTES.SIZE_GUIDE}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Hướng dẫn chọn size
              </Link>
              <Link
                to={ROUTES.TERMS}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Điều khoản
              </Link>
            </div>
          </div>

          {/* Customer Support */}
          <div className="flex flex-col gap-4">
            <h3 className="text-text-main dark:text-white font-bold text-base">
              Hỗ trợ khách hàng
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.SIZE_GUIDE}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Hướng dẫn chọn size
              </Link>
              <Link
                to={ROUTES.CONTACT}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Liên hệ
              </Link>
              <Link
                to={ROUTES.TERMS}
                className="text-text-sub dark:text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Chính sách đổi trả
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-text-main dark:text-white font-bold text-base">Liên hệ</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2 text-sm text-text-sub dark:text-gray-500">
                <span className="material-symbols-outlined text-lg mt-0.5">location_on</span>
                <span>
                  123 Đường Nguyễn Huệ, Quận 1,<br />
                  TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-sub dark:text-gray-500">
                <span className="material-symbols-outlined text-lg">call</span>
                <span>090 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-sub dark:text-gray-500">
                <span className="material-symbols-outlined text-lg">mail</span>
                <span>support@yori.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 text-center">
          <p className="text-text-sub dark:text-gray-600 text-xs">
            © 2024 YORI. All rights reserved. Designed with minimalist soul.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

