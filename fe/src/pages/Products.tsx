import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import ProductCard from '@/components/product/ProductCard'
import Pagination from '@/components/common/Pagination'
import Select from '@/components/common/Select'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { getProducts, ProductsResponse } from '@/services/products.service'
import { getCategories } from '@/services/categories.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import type { Product, Category, ProductFilters } from '@/types'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState({
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Sản phẩm', path: ROUTES.PRODUCTS },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-8">
              Tất cả sản phẩm
            </h1>

            {/* Filters Section */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <Select
                    label="Danh mục"
                    placeholder="Tất cả danh mục"
                    value={filters.category_slug || ''}
                    onChange={(e) =>
                      handleFilterChange('category_slug', e.target.value || undefined)
                    }
                    options={[
                      { value: '', label: 'Tất cả danh mục' },
                      ...categories.map((cat) => ({
                        value: cat.slug,
                        label: cat.name,
                      })),
                    ]}
                  />
                </div>

                {/* Price Range */}
                <div className="flex gap-4 flex-1">
                  <Input
                    label="Giá tối thiểu"
                    type="number"
                    placeholder="0"
                    value={filters.price_min?.toString() || ''}
                    onChange={(e) =>
                      handleFilterChange(
                        'price_min',
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                  <Input
                    label="Giá tối đa"
                    type="number"
                    placeholder="∞"
                    value={filters.price_max?.toString() || ''}
                    onChange={(e) =>
                      handleFilterChange(
                        'price_max',
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </div>

                {/* Rating Filter */}
                <div className="flex-1">
                  <Select
                    label="Đánh giá"
                    placeholder="Tất cả"
                    value={filters.rating_filter?.toString() || ''}
                    onChange={(e) =>
                      handleFilterChange(
                        'rating_filter',
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    options={[
                      { value: '', label: 'Tất cả' },
                      { value: '4', label: '4 sao trở lên' },
                      { value: '3', label: '3 sao trở lên' },
                      { value: '2', label: '2 sao trở lên' },
                      { value: '1', label: '1 sao trở lên' },
                    ]}
                  />
                </div>

                {/* Sort */}
                <div className="flex-1">
                  <Select
                    label="Sắp xếp"
                    value={`${filters.sort_by || 'createdAt'}_${filters.order || 'desc'}`}
                    onChange={(e) => {
                      const [sort_by, order] = e.target.value.split('_')
                      handleFilterChange('sort_by', sort_by as ProductFilters['sort_by'])
                      handleFilterChange('order', order as ProductFilters['order'])
                    }}
                    options={[
                      { value: 'createdAt_desc', label: 'Mới nhất' },
                      { value: 'createdAt_asc', label: 'Cũ nhất' },
                      { value: 'price_asc', label: 'Giá: Thấp đến cao' },
                      { value: 'price_desc', label: 'Giá: Cao đến thấp' },
                      { value: 'sold_desc', label: 'Bán chạy nhất' },
                      { value: 'view_desc', label: 'Xem nhiều nhất' },
                    ]}
                  />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button variant="outline" onClick={handleClearFilters}>
                      Xóa bộ lọc
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
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
                <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={fetchProducts}>Thử lại</Button>
              </div>
            ) : products.length > 0 ? (
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
                  inventory_2
                </span>
                <p className="text-xl font-semibold text-text-main dark:text-white mb-2">
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-text-sub dark:text-gray-400 mb-6">
                  Thử thay đổi bộ lọc để tìm thêm sản phẩm
                </p>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters}>Xóa bộ lọc</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Products
