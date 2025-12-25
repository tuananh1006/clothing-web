import { Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { ROUTES } from '@/utils/constants'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-9xl font-black text-primary mb-4">404</h1>
              <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
                Trang không tìm thấy
              </h2>
              <p className="text-lg text-text-sub dark:text-gray-400 mb-8">
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.HOME}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary hover:bg-[#159cc9] text-white focus:ring-primary transform hover:translate-y-[-1px] hover:shadow-md px-6 py-3 text-lg w-full sm:w-auto"
              >
                <span className="material-symbols-outlined mr-2">home</span>
                Về trang chủ
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 text-lg w-full sm:w-auto"
              >
                <span className="material-symbols-outlined mr-2">shopping_bag</span>
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
