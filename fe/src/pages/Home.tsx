import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ProductCard from '@/components/product/ProductCard'
import Skeleton from '@/components/common/Skeleton'
import { getBanners } from '@/services/banners.service'
import { getProducts } from '@/services/products.service'
import { getCategories } from '@/services/categories.service'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'
import type { Banner, Product, Category } from '@/types'

const Home = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingBanners, setIsLoadingBanners] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isLoadingBestSellers, setIsLoadingBestSellers] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const { addToCart } = useCart()
  const { showSuccess, showError } = useToast()

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoadingBanners(true)
        const data = await getBanners('home_hero')
        setBanners(data)
      } catch (err: any) {
        console.error('Error fetching banners:', err)
        setError('Không thể tải banners')
      } finally {
        setIsLoadingBanners(false)
      }
    }

    fetchBanners()
  }, [])

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const response = await getProducts({
          is_featured: true,
          limit: 8,
          page: 1,
        })
        setFeaturedProducts(response.products)
      } catch (err: any) {
        console.error('Error fetching featured products:', err)
        setError('Không thể tải sản phẩm nổi bật')
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Fetch best sellers
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoadingBestSellers(true)
        const response = await getProducts({
          sort_by: 'sold', // Sort by sold count
          order: 'desc',
          limit: 4,
          page: 1,
        })
        setBestSellers(response.products)
      } catch (err: any) {
        console.error('Error fetching best sellers:', err)
      } finally {
        setIsLoadingBestSellers(false)
      }
    }

    fetchBestSellers()
  }, [])

  // Fetch categories for home page
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true)
        const data = await getCategories()
        // Filter for specific categories: Đồ Len & Dệt Kim, Denim Tối Giản, Phụ Kiện
        const homeCategories = data.filter(
          (cat) =>
            cat.slug === 'do-len-det-kim' ||
            cat.slug === 'denim-toi-gian' ||
            cat.slug === 'phu-kien' ||
            cat.name.toLowerCase().includes('len') ||
            cat.name.toLowerCase().includes('denim') ||
            cat.name.toLowerCase().includes('phụ kiện')
        )
        setCategories(homeCategories.slice(0, 3))
      } catch (err: any) {
        console.error('Error fetching categories:', err)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) {
      showError('Vui lòng nhập email')
      return
    }
    // TODO: Implement newsletter subscription API
    showSuccess('Đăng ký nhận tin thành công!')
    setNewsletterEmail('')
  }

  const handleAddToCartFromBestSeller = async (product: Product) => {
    try {
      await addToCart({
        product_id: product._id,
        buy_count: 1,
      })
      showSuccess('Đã thêm vào giỏ hàng')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể thêm vào giỏ hàng')
    }
  }

  // Auto-rotate banner carousel
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        {/* Hero Section - Banner Carousel */}
        <div className="w-full px-4 lg:px-40 py-5 flex justify-center">
          <div className="w-full max-w-[1200px]">
            {isLoadingBanners ? (
              <Skeleton className="w-full h-[560px] rounded-xl" />
            ) : banners.length > 0 ? (
              <div className="relative overflow-hidden rounded-xl h-[560px] bg-cover bg-center group">
                {banners.map((banner, index) => (
                  <div
                    key={banner._id || banner.id || index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("${banner.image || banner.image_url}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-end items-start p-10 lg:p-16">
                      <div className="flex flex-col gap-3 text-left max-w-xl">
                        {banner.title && (
                          <h2 className="text-white text-base md:text-lg font-medium tracking-wide uppercase opacity-90">
                            {banner.title}
                          </h2>
                        )}
                        <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em] mb-4">
                          {banner.title?.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < banner.title!.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </h1>
                        {banner.link && (
                          <Link
                            to={banner.link}
                            className="mt-4 w-fit px-8 py-3 bg-primary hover:bg-[#159cc9] text-white rounded-lg text-base font-bold transition-all transform hover:translate-y-[-2px] hover:shadow-lg"
                          >
                            {banner.cta_text || 'Khám Phá Ngay'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Banner Indicators */}
                {banners.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBannerIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentBannerIndex
                            ? 'w-8 bg-white'
                            : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to banner ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[560px] rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-text-sub dark:text-gray-400">Không có banner</p>
              </div>
            )}
          </div>
        </div>

        {/* Brand Philosophy / Intro Section */}
        <div className="w-full px-4 lg:px-40 py-16 flex justify-center bg-white dark:bg-[#1a2c32]">
          <div className="max-w-[720px] text-center flex flex-col gap-4">
            <span className="text-primary font-bold tracking-widest text-xs uppercase">
              Về YORI
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-text-main dark:text-white leading-snug">
              Chúng tôi tin rằng thời trang không chỉ là vẻ bề ngoài, mà là sự phản chiếu của nội tâm yên bình.
            </h3>
            <p className="text-text-sub dark:text-gray-400 text-base md:text-lg mt-2 font-light">
              Mỗi thiết kế của YORI đều mang đậm triết lý tối giản của Nhật Bản, chú trọng vào chất liệu tự nhiên và sự thoải mái tuyệt đối.
            </p>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="w-full px-4 lg:px-40 py-12 flex justify-center bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-[1200px]">
            <div className="flex justify-between items-end mb-8 px-2">
              <h2 className="text-text-main dark:text-white text-3xl font-bold tracking-[-0.015em]">
                Sản phẩm nổi bật
              </h2>
              <Link
                to={ROUTES.PRODUCTS}
                className="text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors text-sm font-medium flex items-center gap-1"
              >
                Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-sub dark:text-gray-400 mb-4">
                  Hiện chưa có sản phẩm nổi bật
                </p>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <div className="w-full px-4 lg:px-40 py-12 flex justify-center bg-gray-50 dark:bg-white/5">
          <div className="max-w-[1200px] w-full">
            {isLoadingCategories ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                <Skeleton className="w-full h-full rounded-xl" />
                <div className="grid grid-rows-2 gap-6">
                  <Skeleton className="w-full h-full rounded-xl" />
                  <Skeleton className="w-full h-full rounded-xl" />
                </div>
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                {/* Large card - Đồ Len & Dệt Kim */}
                {categories[0] && (
                  <Link
                    to={`${ROUTES.PRODUCTS}?category=${categories[0].slug}`}
                    className="relative group overflow-hidden rounded-xl cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: categories[0].image
                          ? `url("${categories[0].image}")`
                          : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6Lm7D1D1o3GUSaDSunJ2gOZxjeZ-odAMibuS7BpqAz2bNkvdaga74ni_BjQnSXRZ0qIrCQLAMu3_rXgjDkzwvFuClJvPpxxvJFVPe3ezVZFWOTD3BshXI8jIM5Tg8QYc3ETGvuzFG0Qb3UJt3Fk3p_6RtCWyuC_RgzMkkC7RjM25MN_LffPEMQHaMjQm5tonOuSgTod31DF4zAyQZClgkuQvJOgC3xa4UAJ-OTmHGFEt8k3xsiq5rmbVIAAbXioxT12bHNfYM0k0")',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-8 left-8">
                      <h3 className="text-white text-2xl font-bold mb-2">{categories[0].name}</h3>
                      <span className="text-white text-sm font-medium underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                        Xem bộ sưu tập
                      </span>
                    </div>
                  </Link>
                )}
                {/* Two smaller cards */}
                <div className="grid grid-rows-2 gap-6">
                  {categories[1] && (
                    <Link
                      to={`${ROUTES.PRODUCTS}?category=${categories[1].slug}`}
                      className="relative group overflow-hidden rounded-xl cursor-pointer"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: categories[1].image
                            ? `url("${categories[1].image}")`
                            : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJe-7ApiUsPoFCgiHguEHxxhqylhrdYn8sCAGcfaN3Tn5LwfGTldpUzbVtnmtCVlVPeAEIwPX2EbVqL7PZskI5jov7xrvtHUSvzTpaoUArNNhD0YYZD9FoQpIswHeEZ07BdAuPIuWqAUyOBbnIz8p59LKtLVel7zL7MyqO0kOSDCqVikgPuj-c9a76m6Pr17sO6IY1kEaUJTRcJeneNeYvsKYHFXxSoJTpfUd44c6ooVuATOvL7aDk5oXQvApCrn3Es8UKSgw2gpU")',
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-white text-xl font-bold">{categories[1].name}</h3>
                      </div>
                    </Link>
                  )}
                  {categories[2] && (
                    <Link
                      to={`${ROUTES.PRODUCTS}?category=${categories[2].slug}`}
                      className="relative group overflow-hidden rounded-xl cursor-pointer"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: categories[2].image
                            ? `url("${categories[2].image}")`
                            : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdYcL7jlW8EOdgxZe_djIC4aQRFoOhZskaFAKCdxReWiP8HtheLwXUAeEwLNKeF64i6tTzD5-Mz1YC-v4VpRakSgY8RnmYoxs97pTOZ5PZVtyCWKemk7xJ1Mfjzsti7me5wJsj3q0K6B7Fk3-W3fLSe4lqLeqPn9Fk9B4ZDzpAwkMMBmV5Bv4l8vUVNtvu-l08qnW8Vmpjlorgnr4WeAQZuHdj-gkNOWT-xDOBUzszEEMUj1gd_5KO27RQcvzOCPR3Thaz_X3IeK0")',
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-white text-xl font-bold">{categories[2].name}</h3>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="w-full px-4 lg:px-40 py-16 flex justify-center bg-background-light dark:bg-background-dark">
          <div className="flex flex-col max-w-[1200px] w-full">
            <div className="flex flex-col items-center mb-10 text-center">
              <h2 className="text-text-main dark:text-white text-3xl font-bold tracking-[-0.015em] mb-2">
                Bán chạy nhất tuần
              </h2>
              <p className="text-text-sub dark:text-gray-400">
                Những món đồ được yêu thích nhất bởi cộng đồng YORI
              </p>
            </div>
            {isLoadingBestSellers ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-3">
                    <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {bestSellers.map((product) => (
                  <div key={product._id} className="flex flex-col gap-3 group cursor-pointer">
                    <Link
                      to={ROUTES.PRODUCT_DETAIL(product.slug)}
                      className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg relative overflow-hidden"
                      style={{
                        backgroundImage: product.image
                          ? `url("${product.image}")`
                          : product.images && product.images.length > 0
                            ? `url("${product.images[0]}")`
                            : '',
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCartFromBestSeller(product)
                          }}
                          className="bg-white text-text-main text-xs font-bold px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </Link>
                    <div>
                      <Link
                        to={ROUTES.PRODUCT_DETAIL(product.slug)}
                        className="text-text-main dark:text-white text-base font-bold leading-normal group-hover:text-primary transition-colors block"
                      >
                        {product.name}
                      </Link>
                      <p className="text-primary font-bold text-sm leading-normal mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="w-full px-4 lg:px-40 py-20 flex justify-center bg-[#e7f0f3] dark:bg-[#152329]">
          <div className="max-w-[600px] w-full text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
            <h2 className="text-text-main dark:text-white text-2xl font-bold mb-2">
              Đăng ký nhận tin
            </h2>
            <p className="text-text-sub dark:text-gray-400 mb-6">
              Nhận thông báo về bộ sưu tập mới và ưu đãi độc quyền từ YORI.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full gap-2 max-w-md">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 rounded-lg border-none px-4 py-3 text-sm focus:ring-2 focus:ring-primary dark:bg-[#1a2c32] dark:text-white text-text-main dark:text-white placeholder:text-gray-400"
                placeholder="Nhập email của bạn..."
              />
              <button
                type="submit"
                className="bg-primary hover:bg-[#159cc9] text-white font-bold rounded-lg px-6 py-3 text-sm transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
