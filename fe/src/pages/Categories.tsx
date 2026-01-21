import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Skeleton from '@/components/common/Skeleton'
import { getCategories } from '@/services/categories.service'
import { ROUTES } from '@/utils/constants'
import type { Category } from '@/types'

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getCategories()
        setCategories(data)
      } catch (err: any) {
        console.error('Error fetching categories:', err)
        setError(err.response?.data?.message || 'Không thể tải danh mục')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const featuredCategories = categories.filter((cat) => cat.is_featured)
  const regularCategories = categories.filter((cat) => !cat.is_featured)

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        {/* Hero / Intro Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex justify-center bg-white dark:bg-[#111820] transition-colors">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div className="max-w-2xl">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 py-4 text-sm mb-4">
                  <a className="text-text-secondary-light dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">Home</a>
                  <span className="text-text-secondary-light dark:text-gray-400">/</span>
                  <span className="text-text-primary-light dark:text-gray-100 font-medium">Danh mục</span>
                </div>

                <h1 className="text-text-primary-light dark:text-gray-50 text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.033em] leading-[1.1] mb-4">
                  Đơn giản hóa tủ quần áo của bạn.
                </h1>
                <p className="text-text-secondary-light dark:text-gray-300 text-lg sm:text-xl font-normal max-w-lg">
                  Những sản phẩm chất lượng được thiết kế tại Tokyo. Những món đồ vượt thời gian cho cuộc sống hàng ngày của bạn.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Category Grid */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 flex justify-center bg-surface-light dark:bg-[#101820] transition-colors">
          <div className="w-full max-w-[1280px]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="w-full aspect-[3/4] rounded-2xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-400 mb-4">
                  error_outline
                </span>
                <p className="text-xl font-bold text-text-primary-light dark:text-gray-100 mb-2">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {featuredCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
                    className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-[#1b2833] shadow-md hover:shadow-2xl transition-all duration-300 border border-primary/20 dark:border-primary/40"
                  >
                    {/* Image Container */}
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-400">
                            category
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Gradient Overlay with Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 via-black/15 to-transparent pt-20">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white text-2xl font-bold tracking-tight mb-1 drop-shadow">
                            {category.name.toUpperCase()}
                          </h3>
                          {category.description && (
                            <p className="text-white/85 text-sm font-medium line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="bg-primary/90 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs font-semibold uppercase tracking-wide">
                          Nổi bật
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {regularCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
                    className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-[#1b2833] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/60 dark:border-white/5"
                  >
                    {/* Image Container */}
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                        <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-400">
                            category
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Gradient Overlay with Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 via-black/10 to-transparent pt-20">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white text-2xl font-bold tracking-tight mb-1 drop-shadow">
                            {category.name.toUpperCase()}
                          </h3>
                          {category.description && (
                            <p className="text-white/85 text-sm font-medium line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <span className="material-symbols-outlined !text-[20px]">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-400 mb-4">
                  folder_open
                </span>
                <p className="text-xl font-bold text-text-primary-light dark:text-gray-100 mb-2">
                  Chưa có danh mục nào
                </p>
                <p className="text-text-secondary-light dark:text-gray-300">
                  Danh mục sẽ được cập nhật sớm
                </p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}

export default Categories
