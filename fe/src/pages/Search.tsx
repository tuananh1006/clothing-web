import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import ProductCard from '@/components/product/ProductCard'
import Input from '@/components/common/Input'
import Pagination from '@/components/common/Pagination'
import Skeleton from '@/components/common/Skeleton'
import { getProducts, ProductsResponse } from '@/services/products.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import type { Product } from '@/types'

const Search = () => {
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

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced search function
  const performSearch = useCallback(
    async (query: string, page: number = 1) => {
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
        const response: ProductsResponse = await getProducts({
          name: query.trim(),
          page,
          limit: PAGINATION.DEFAULT_LIMIT,
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
    []
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
      performSearch(searchQuery, pageParam)
    }
  }, [pageParam, searchQuery, performSearch])

  // Initial search if query exists in URL
  useEffect(() => {
    if (searchQuery && searchInput === searchQuery) {
      performSearch(searchQuery, pageParam)
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
    performSearch(searchInput, 1)
    const params = new URLSearchParams()
    if (searchInput.trim()) {
      params.set('q', searchInput.trim())
    }
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Tìm kiếm', path: ROUTES.SEARCH },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-8">
              Tìm kiếm sản phẩm
            </h1>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Nhập tên sản phẩm bạn muốn tìm..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  leftIcon={<span className="material-symbols-outlined">search</span>}
                  className="w-full pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Search"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </form>

            {/* Search Results */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                  error_outline
                </span>
                <p className="text-xl font-semibold text-text-main dark:text-white mb-2">
                  {error}
                </p>
                <button
                  onClick={() => performSearch(searchInput, pagination.page)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors"
                >
                  Thử lại
                </button>
              </div>
            ) : searchQuery ? (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-text-sub dark:text-gray-400">
                    Tìm thấy <span className="font-semibold text-text-main dark:text-white">
                      {pagination.total_page > 0
                        ? `${products.length} sản phẩm`
                        : '0 sản phẩm'}
                    </span>{' '}
                    cho từ khóa &quot;<span className="font-semibold text-primary">{searchQuery}</span>&quot;
                  </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
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
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                      search_off
                    </span>
                    <p className="text-xl font-semibold text-text-main dark:text-white mb-2">
                      Không tìm thấy sản phẩm
                    </p>
                    <p className="text-text-sub dark:text-gray-400 mb-6">
                      Không có sản phẩm nào khớp với từ khóa &quot;
                      <span className="font-medium">{searchQuery}</span>&quot;
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setSearchInput('')}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors"
                      >
                        Xóa tìm kiếm
                      </button>
                      <Link
                        to={ROUTES.PRODUCTS}
                        className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-text-main dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Xem tất cả sản phẩm
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                  search
                </span>
                <p className="text-xl font-semibold text-text-main dark:text-white mb-2">
                  Tìm kiếm sản phẩm
                </p>
                <p className="text-text-sub dark:text-gray-400 mb-6">
                  Nhập từ khóa vào ô tìm kiếm để bắt đầu
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
      </main>
      <Footer />
    </div>
  )
}

export default Search
