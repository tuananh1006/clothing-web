import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Skeleton from '@/components/common/Skeleton'
import { getCategories } from '@/services/categories.service'
import { ROUTES } from '@/utils/constants'
import type { Category } from '@/types'

type FilterChip = 'all' | 'new-arrivals' | 'best-sellers' | 'essentials'

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all')

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

  const filterChips: { value: FilterChip; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'new-arrivals', label: 'Hàng mới' },
    { value: 'best-sellers', label: 'Bán chạy' },
    { value: 'essentials', label: 'Cơ bản' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        {/* Hero / Intro Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex justify-center">
          <div className="w-full max-w-[1280px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div className="max-w-2xl">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 py-4 text-sm mb-4">
                  <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">Home</a>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
                  <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Danh mục</span>
                </div>

                <h1 className="text-text-primary-light dark:text-text-primary-dark text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.033em] leading-[1.1] mb-4">
                  Đơn giản hóa tủ quần áo của bạn.
                </h1>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg sm:text-xl font-normal max-w-lg">
                  Những sản phẩm chất lượng được thiết kế tại Tokyo. Những món đồ vượt thời gian cho cuộc sống hàng ngày của bạn.
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 pb-1">
              {filterChips.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setActiveFilter(chip.value)}
                  className={`flex h-10 items-center justify-center px-5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === chip.value
                      ? 'bg-text-primary-light dark:bg-text-primary-dark text-background-light dark:text-background-dark'
                      : 'bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 flex justify-center">
          <div className="w-full max-w-[1280px]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="w-full aspect-[3/4] rounded-2xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                  error_outline
                </span>
                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
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
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`${ROUTES.PRODUCTS}?category=${category.slug}`}
                    className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                            category
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Gradient Overlay with Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent pt-20">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="text-white text-2xl font-bold tracking-tight mb-1">
                            {category.name.toUpperCase()}
                          </h3>
                          {category.description && (
                            <p className="text-white/90 text-sm font-medium">
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
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                  folder_open
                </span>
                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
                  Chưa có danh mục nào
                </p>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Danh mục sẽ được cập nhật sớm
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Collection (New Arrivals) */}
        {!isLoading && categories.length > 0 && (
          <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 flex justify-center bg-surface-light dark:bg-[#152329]">
            <div className="w-full max-w-[1280px] py-16">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold">
                  Hàng mới
                </h2>
                <a
                  href={ROUTES.PRODUCTS}
                  className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Xem tất cả <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </a>
              </div>

              {/* Mini Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Product 1 */}
                <div className="flex flex-col gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 aspect-[3/4]">
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuByswNDi1QDKLCOe1PKAwbRMR2PFufN_9dSk1-VMeL08lL9o7ka6K0pDsZW1HMdIh2Lyr94hSx5EYBxx-pvRAdobmmwjaeyfZLBWhkdNwcUK-T13cRn_ORkqClLUNMr978ubqPeSji0O-wwPGowij8DvqAPG20LPAc3YnkbST1y9YpSz-BtZ8Dex4ei3PpdkRxP3nFh7Ux_r1jj2iFwLqWLWcMiTYhRMu8Oehj35PsJC8oUCsDH4580zfGjJSJg-5Iay8TVdY2aQ08")',
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-surface-dark/90 backdrop-blur px-2 py-1 text-xs font-bold uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark rounded-sm">
                      New
                    </div>
                  </div>
                  <div>
                    <h4 className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm">
                      Oversized Tee
                    </h4>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                      Soft Cotton Blend
                    </p>
                    <p className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm mt-1">
                      450.000₫
                    </p>
                  </div>
                </div>

                {/* Product 2 */}
                <div className="flex flex-col gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 aspect-[3/4]">
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmV37GiZXc0fle8UGBZ294tuMZ3R6Q-_HxM_IHlagD0p9rIkJJrAgdrZCla3bOfjg535k5LJbfd4tYqmDP7p8adGRWQd426mZ8WAYFfhVOVTkgovhjN36Je8QGvaOTLqpWHJ0V50l3oRjI7pkq9ZezifzkUadFIvvSCSRVwZjdW-8gQy6UP_y24y3e_8RIVde_AioDX8F1ejzvC9SFEJ3TOX7nQ1E_RYs1HJe7hBAsjh9s5QS4EDCzZDTOAP2KQBpQ4wS5thkwq6E")',
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm">
                      Casual Shorts
                    </h4>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                      Breathable Fabric
                    </p>
                    <p className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm mt-1">
                      380.000₫
                    </p>
                  </div>
                </div>

                {/* Product 3 */}
                <div className="flex flex-col gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 aspect-[3/4]">
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAuphSJZW0nfjT43xE6zZ3I4DfscZLbH9FleQ-9TMcyVEieco0EbS5IErzipbesA5FIuyyuQvErI0OMOnD0s5JpLdPNXnLCvVGdpMnuTx2MyGeHBYArh3ZbqZKWDL1tHZMC0ngzvm165L4Xbyi4JY7nvZYBXKFZlEfYbyzcf3_c7wvAbNOAjjXo_0A_YF-8IIO1YlHxSy2If3GyrLRX0qLw3u3M1fSHM2JOZnHeG3QyPeTv3zYcqq_kvWONdA1Y2pgYhNhq0nfmiA")',
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm">
                      Denim Jacket
                    </h4>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                      Classic Blue Wash
                    </p>
                    <p className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm mt-1">
                      890.000₫
                    </p>
                  </div>
                </div>

                {/* Product 4 */}
                <div className="flex flex-col gap-3 group cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 aspect-[3/4]">
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDURkvJEv5Tgt5R84kVlpcuu1Jb06gjb55-JggWm14L6oAg3pp1zk87LSDNIlAQLX3klF-0Ndco_cCoxcuWS2srVsUamH5j4MMSAd6S2OM-YiI0Xld7ACyQEKm-5D9E9WjN94jPwPZhJh6FODogV0voRcA8jecVeHGX2ELRBVH_WYUQ_ZwaFfCluxxI6jLkIRFWUlYE8b27sB1BRVYKqB6Ogb_RN8IQIO0cJaaNGmNc5955BbJAybQsveSqjKyCUC99opUZOn5IqJI")',
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-primary/90 dark:bg-primary/80 backdrop-blur px-2 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm">
                      Best Seller
                    </div>
                  </div>
                  <div>
                    <h4 className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm">
                      Modern Polo
                    </h4>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                      Slim Fit
                    </p>
                    <p className="text-text-primary-light dark:text-text-primary-dark font-bold text-sm mt-1">
                      520.000₫
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Categories
