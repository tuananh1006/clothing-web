import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ProductCard from '@/components/product/ProductCard'
import Pagination from '@/components/common/Pagination'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { getProducts, ProductsResponse } from '@/services/products.service'
import { getCategories } from '@/services/categories.service'
import { PAGINATION } from '@/utils/constants'
import type { Product, Category, ProductFilters } from '@/types'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total_page: number
  }>({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters from URL params
  const [filters, setFilters] = useState<ProductFilters>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    category_slug: searchParams.get('category') || undefined,
    name: searchParams.get('search') || undefined,
    sort_by: (searchParams.get('sort_by') as ProductFilters['sort_by']) || undefined,
    order: (searchParams.get('order') as ProductFilters['order']) || 'desc',
    price_min: searchParams.get('price_min') ? parseFloat(searchParams.get('price_min')!) : undefined,
    price_max: searchParams.get('price_max') ? parseFloat(searchParams.get('price_max')!) : undefined,
    rating_filter: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response: ProductsResponse = await getProducts(filters)
      setProducts(response.products)
      setPagination(response.pagination)
    } catch (err: any) {
      console.error('Error fetching products:', err)
      setError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString())
    if (filters.category_slug) params.set('category', filters.category_slug)
    if (filters.name) params.set('search', filters.name)
    if (filters.sort_by) params.set('sort_by', filters.sort_by)
    if (filters.order && filters.order !== 'desc') params.set('order', filters.order)
    if (filters.price_min !== undefined) params.set('price_min', filters.price_min.toString())
    if (filters.price_max !== undefined) params.set('price_max', filters.price_max.toString())
    if (filters.rating_filter !== undefined) params.set('rating', filters.rating_filter.toString())

    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  // Handle filter changes
  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to page 1 when filters change
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: PAGINATION.DEFAULT_LIMIT,
    })
    setSearchParams({}, { replace: true })
  }

  const hasActiveFilters = !!(
    filters.category_slug ||
    filters.name ||
    filters.price_min !== undefined ||
    filters.price_max !== undefined ||
    filters.rating_filter !== undefined ||
    (filters.sort_by && filters.sort_by !== 'createdAt') ||
    (filters.order && filters.order !== 'desc')
  )

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 py-4 text-sm">
            <a className="text-text-secondary-light dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" href="#">Home</a>
            <span className="text-text-secondary-light dark:text-gray-400">/</span>
            <span className="text-text-primary-light dark:text-gray-100 font-medium">Sản phẩm</span>
          </div>

          {/* Page Heading & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#e7f0f3] dark:border-gray-800 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.033em] text-text-primary-light dark:text-gray-50">
                Tất cả sản phẩm
              </h1>
              <p className="text-text-secondary-light dark:text-gray-300 text-lg max-w-2xl">
                Khám phá bộ sưu tập sản phẩm chất lượng cao từ YORI
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <select
                  value={`${filters.sort_by || 'createdAt'}_${filters.order || 'desc'}`}
                  onChange={(e) => {
                    const [sort_by, order] = e.target.value.split('_')
                    handleFilterChange('sort_by', sort_by as ProductFilters['sort_by'])
                    handleFilterChange('order', order as ProductFilters['order'])
                  }}
                  className="appearance-none bg-surface-light dark:bg-[#1b2833] border border-[#d0e1e7] dark:border-gray-700 text-text-primary-light dark:text-gray-100 rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-sm font-medium transition-shadow hover:shadow-sm"
                >
                  <option value="createdAt_desc">Mới nhất</option>
                  <option value="createdAt_asc">Cũ nhất</option>
                  <option value="price_asc">Giá: Thấp đến cao</option>
                  <option value="price_desc">Giá: Cao đến thấp</option>
                  <option value="sold_desc">Bán chạy nhất</option>
                  <option value="view_desc">Xem nhiều nhất</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400 pointer-events-none text-lg">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
              {/* Mobile Filter Button */}
              <div className="flex items-center justify-between lg:hidden mb-4">
                <button className="flex items-center gap-2 text-sm font-bold bg-gray-100 dark:bg-[#1b2833] text-text-primary-light dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Bộ lọc
                </button>
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex flex-col gap-6">
                {/* Category Filter */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-gray-100 mb-4">
                    Danh mục
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={!filters.category_slug}
                          onChange={() => handleFilterChange('category_slug', undefined)}
                          className="size-4 rounded border-gray-300 text-primary focus:ring-primary bg-transparent cursor-pointer"
                        />
                        <span className={filters.category_slug ? 'text-text-secondary-light dark:text-gray-300 group-hover:text-primary transition-colors' : 'text-text-primary-light dark:text-gray-100 font-medium'}>
                          Tất cả
                        </span>
                      </label>
                    </li>
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.category_slug === category.slug}
                            onChange={() =>
                              handleFilterChange(
                                'category_slug',
                                filters.category_slug === category.slug ? undefined : category.slug
                              )
                            }
                            className="size-4 rounded border-gray-300 text-primary focus:ring-primary bg-transparent cursor-pointer"
                          />
                          <span className={filters.category_slug === category.slug ? 'text-text-primary-light dark:text-gray-100 font-medium' : 'text-text-secondary-light dark:text-gray-300 group-hover:text-primary transition-colors'}>
                            {category.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range Filter */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-gray-100 mb-4">
                    Giá
                  </h3>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400">₫</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.price_min?.toString() || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'price_min',
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-[#1b2833] py-2 pl-7 pr-2 text-right focus:border-primary focus:ring-primary text-text-primary-light dark:text-gray-100"
                      />
                    </div>
                    <span className="text-text-secondary-light dark:text-gray-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-gray-400">₫</span>
                      <input
                        type="number"
                        placeholder="∞"
                        value={filters.price_max?.toString() || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'price_max',
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-[#1b2833] py-2 pl-7 pr-2 text-right focus:border-primary focus:ring-primary text-text-primary-light dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="pb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-gray-100 mb-4">
                    Đánh giá
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: undefined, label: 'Tất cả' },
                      { value: 4, label: '4 sao trở lên' },
                      { value: 3, label: '3 sao trở lên' },
                      { value: 2, label: '2 sao trở lên' },
                      { value: 1, label: '1 sao trở lên' },
                    ].map((option) => (
                      <label key={option.value || 'all'} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating_filter === option.value}
                          onChange={() => handleFilterChange('rating_filter', option.value)}
                          className="size-4 rounded-full border-gray-300 text-primary focus:ring-primary bg-transparent cursor-pointer"
                        />
                        <span className={filters.rating_filter === option.value ? 'text-text-primary-light dark:text-gray-100 font-medium' : 'text-text-secondary-light dark:text-gray-300 group-hover:text-primary transition-colors'}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="outline" onClick={handleClearFilters} className="w-full">
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="flex flex-col gap-3">
                      <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-400 mb-4">
                    error_outline
                  </span>
                  <p className="text-red-500 dark:text-red-400 mb-4 text-lg font-semibold">{error}</p>
                  <Button onClick={fetchProducts}>Thử lại</Button>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mb-12">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.total_page > 1 && (
                    <div className="mt-12">
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.total_page}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-400 mb-4">
                    inventory_2
                  </span>
                  <p className="text-xl font-bold text-text-primary-light dark:text-gray-100 mb-2">
                    Không tìm thấy sản phẩm
                  </p>
                  <p className="text-text-secondary-light dark:text-gray-300 mb-6">
                    Thử thay đổi bộ lọc để tìm thêm sản phẩm
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters}>Xóa bộ lọc</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Products
