import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Pagination from '@/components/common/Pagination'
import Skeleton from '@/components/common/Skeleton'
import { getProducts, ProductsResponse } from '@/services/products.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/contexts/WishlistContext'
import type { Product } from '@/types'

const Search = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const pageParam = parseInt(searchParams.get('page') || '1')

  const [searchInput, setSearchInput] = useState(searchQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total_page: number
  }>({
    page: pageParam,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('latest_asc')

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const suggestedTags = ['Linen', 'Quần ống rộng', 'Phụ kiện']

  // Parse sortBy to sort_by and order
  const parseSortBy = (sortByValue: string) => {
    switch (sortByValue) {
      case 'latest_asc':
        return { sort_by: 'createdAt' as const, order: 'desc' as const } // Mới nhất = desc
      case 'price_asc':
        return { sort_by: 'price' as const, order: 'asc' as const }
      case 'price_desc':
        return { sort_by: 'price' as const, order: 'desc' as const }
      case 'best_seller':
        return { sort_by: 'sold' as const, order: 'desc' as const }
      default:
        return { sort_by: 'createdAt' as const, order: 'desc' as const }
    }
  }

  // Debounced search function
  const performSearch = useCallback(
    async (query: string, page: number = 1, sortByValue: string = sortBy) => {
      if (!query.trim()) {
        setProducts([])
        setPagination({
          page: 1,
          limit: PAGINATION.DEFAULT_LIMIT,
          total_page: 1,
        })
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const { sort_by, order } = parseSortBy(sortByValue)
        const response: ProductsResponse = await getProducts({
          name: query.trim(),
          page,
          limit: PAGINATION.DEFAULT_LIMIT,
          sort_by,
          order,
        })
        setProducts(response.products)
        setPagination(response.pagination)
      } catch (err: any) {
        console.error('Error searching products:', err)
        setError(err.response?.data?.message || 'Không thể tìm kiếm sản phẩm')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    },
    [sortBy]
  )

  // Handle search input change with debounce
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Update URL params immediately
    const params = new URLSearchParams()
    if (searchInput.trim()) {
      params.set('q', searchInput.trim())
    }
    if (pageParam > 1) {
      params.set('page', pageParam.toString())
    }
    setSearchParams(params, { replace: true })

    // Debounce the actual search
    if (searchInput.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchInput, 1)
        // Reset to page 1 when search query changes
        const newParams = new URLSearchParams()
        newParams.set('q', searchInput.trim())
        setSearchParams(newParams, { replace: true })
      }, 500) // 500ms debounce
    } else {
      setProducts([])
      setPagination({
        page: 1,
        limit: PAGINATION.DEFAULT_LIMIT,
        total_page: 1,
      })
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchInput, performSearch, setSearchParams])

  // Handle page change
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery, pageParam, sortBy)
    }
  }, [pageParam, searchQuery, performSearch, sortBy])

  // Initial search if query exists in URL
  useEffect(() => {
    if (searchQuery && searchInput === searchQuery) {
      performSearch(searchQuery, pageParam, sortBy)
    }
  }, []) // Only run once on mount

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    performSearch(searchInput, 1, sortBy)
    const params = new URLSearchParams()
    if (searchInput.trim()) {
      params.set('q', searchInput.trim())
    }
    setSearchParams(params, { replace: true })
  }

  const handleSuggestedTag = (tag: string) => {
    setSearchInput(tag)
    performSearch(tag, 1, sortBy)
    const params = new URLSearchParams()
    params.set('q', tag)
    setSearchParams(params, { replace: true })
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      product_id: product._id,
      buy_count: 1,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0] || '',
    })
  }

  const handleProductClick = (product: Product) => {
    navigate(`${ROUTES.PRODUCTS}/${product.slug}`)
  }

  const handleToggleWishlist = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleWishlist(product)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value
    setSortBy(newSortBy)
    if (searchQuery) {
      // Reset to page 1 - useEffect will handle the search
      const params = new URLSearchParams(searchParams)
      params.set('page', '1')
      setSearchParams(params, { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow w-full flex flex-col items-center pt-8 pb-20">
        <div className="w-full max-w-[1280px] px-4 md:px-10 flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 text-sm">
            <a className="text-text-sub dark:text-gray-400 hover:text-primary transition-colors" href={ROUTES.HOME}>
              Trang chủ
            </a>
            <span className="text-text-sub dark:text-gray-400">/</span>
            <span className="text-text-main dark:text-white font-medium">
              Tìm kiếm
            </span>
          </div>

          {/* Hero Search Section */}
          <div className="flex flex-col items-center gap-6 py-6 w-full max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center tracking-tight text-text-main dark:text-white">
              Tìm kiếm sản phẩm
            </h1>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm (ví dụ: Áo khoác, Linen)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl border-none ring-1 ring-gray-200 dark:ring-gray-700 bg-surface-light dark:bg-surface-dark shadow-sm focus:ring-2 focus:ring-primary focus:shadow-md transition-all text-base placeholder:text-gray-400 dark:placeholder:text-gray-400 text-text-main dark:text-white"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-2 flex items-center bg-primary text-white p-2 rounded-lg hover:bg-opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">
                  arrow_forward
                </span>
              </button>
            </form>

            {/* Search Tags */}
            {!searchQuery && (
              <div className="flex flex-wrap justify-center gap-3">
                <span className="text-sm text-text-sub dark:text-gray-400">
                  Từ khóa phổ biến:
                </span>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSuggestedTag(tag)}
                    className="px-3 py-1 bg-surface-light dark:bg-surface-dark rounded-full border border-gray-200 dark:border-gray-700 text-sm text-text-main dark:text-white hover:border-primary hover:text-primary transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          {searchQuery && <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />}

          {/* Results Toolbar */}
          {searchQuery && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-lg font-semibold text-text-main dark:text-white">
                Kết quả tìm kiếm
              </h3>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-sm font-medium text-text-main dark:text-white whitespace-nowrap">
                  Sắp xếp:
                </label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-text-main dark:text-white appearance-none cursor-pointer"
                >
                  <option value="latest_asc">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="best_seller">Bán chạy</option>
                </select>
              </div>
            </div>
          )}

          {/* Search Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 w-full">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4 block">
                error_outline
              </span>
              <p className="text-xl font-bold text-text-main dark:text-white mb-2">
                {error}
              </p>
              <button
                onClick={() => performSearch(searchInput, pagination.page)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : searchQuery ? (
            <>
              {/* Results Count */}
              <div className="mb-2">
                <p className="text-text-sub dark:text-gray-400">
                  Tìm thấy{' '}
                  <span className="font-semibold text-text-main dark:text-white">
                    {pagination.total_page > 0 ? `${products.length} sản phẩm` : '0 sản phẩm'}
                  </span>{' '}
                  cho từ khóa &quot;
                  <span className="font-semibold text-primary">{searchQuery}</span>&quot;
                </p>
              </div>

              {/* Products Grid */}
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="group flex flex-col gap-3 cursor-pointer"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
                                image
                              </span>
                            </div>
                          )}
                          {/* Wishlist button */}
                          {product._id && (
                            <button
                              onClick={(e) => handleToggleWishlist(product, e)}
                              className={`absolute top-3 right-3 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full border shadow-md backdrop-blur transition-all ${
                                isInWishlist(product._id)
                                  ? 'bg-primary text-white border-primary/30 shadow-primary/20'
                                  : 'bg-white/80 dark:bg-black/40 text-text-main dark:text-white border-white/40 dark:border-white/10 hover:bg-primary hover:text-white hover:border-primary/30'
                              }`}
                              aria-label={isInWishlist(product._id) ? 'Xoá khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                            >
                              <span className="material-symbols-outlined text-[20px] leading-none">
                                {isInWishlist(product._id) ? 'favorite' : 'favorite_border'}
                              </span>
                            </button>
                          )}
                          {/* Add to cart button */}
                          <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 text-text-main dark:text-white shadow-md hover:bg-primary hover:text-white transition-colors"
                              aria-label="Thêm vào giỏ hàng"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                add_shopping_cart
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-base font-medium text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-sm font-bold text-primary">
                            {product.price?.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.total_page > 1 && (
                    <Pagination
                      currentPage={pagination.page}
                      totalPages={pagination.total_page}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12 w-full">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4 block">
                    search_off
                  </span>
                  <p className="text-xl font-bold text-text-main dark:text-white mb-2">
                    Không tìm thấy sản phẩm
                  </p>
                  <p className="text-text-sub dark:text-gray-400 mb-6">
                    Không có sản phẩm nào khớp với từ khóa &quot;
                    <span className="font-medium">{searchQuery}</span>&quot;
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      onClick={() => setSearchInput('')}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Xóa tìm kiếm
                    </button>
                    <Link
                      to={ROUTES.PRODUCTS}
                      className="px-6 py-2 bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-text-main dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Xem tất cả sản phẩm
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 w-full">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4 block">
                search
              </span>
              <p className="text-xl font-bold text-text-main dark:text-white mb-2">
                Tìm kiếm sản phẩm
              </p>
              <p className="text-text-sub dark:text-gray-400 mb-6">
                Nhập từ khóa vào ô tìm kiếm để bắt đầu
              </p>
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Search
