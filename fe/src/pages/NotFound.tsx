import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { ROUTES } from '@/utils/constants'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-40 w-full">
          <div className="bg-white dark:bg-[#1a2c32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Text content - order-2 on mobile, order-1 on desktop */}
              <div className="order-2 md:order-1 w-full md:w-1/2 text-center md:text-left">
                <div className="mb-8">
                  <h1 className="text-9xl font-black text-primary mb-4">404</h1>
                  <h2 className="text-3xl font-bold text-text-main dark:text-white mb-4">
                    Trang không tìm thấy
                  </h2>
                  <p className="text-lg text-text-sub dark:text-gray-400 mb-8">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to={ROUTES.HOME}
                    className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary hover:bg-[#159cc9] text-white focus:ring-primary transform hover:translate-y-[-1px] hover:shadow-md px-6 py-3 text-lg"
                  >
                    <span className="material-symbols-outlined mr-2">home</span>
                    Về trang chủ
                  </Link>
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 text-lg"
                  >
                    <span className="material-symbols-outlined mr-2">shopping_bag</span>
                    Xem sản phẩm
                  </Link>
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary hover:bg-[#159cc9] text-white focus:ring-primary transform hover:translate-y-[-1px] hover:shadow-md px-6 py-3 text-lg"
                  >
                    <span className="material-symbols-outlined mr-2">arrow_back</span>
                    Quay lại
                  </button>
                </div>
              </div>

              {/* Image section - order-1 on mobile, order-2 on desktop */}
              <div className="order-1 md:order-2 w-full md:w-1/2">
                <div 
                  className="aspect-[4/5] rounded-xl overflow-hidden bg-cover bg-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs")`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
