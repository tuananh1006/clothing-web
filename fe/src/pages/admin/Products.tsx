import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Button from '@/components/common/Button'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import ProductFormModal from '@/components/admin/ProductFormModal'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import { PAGINATION } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'
import { Category } from '@/types'

// Define type matching the actual API response from Admin Controller
interface AdminProductItem {
  _id: string
  id: string
  name: string
  sku: string
  thumbnail_url: string
  category_name: string
  price: number
  price_display: string
  stock_quantity: number
  stock_status: string
  status: string
  status_label: string
  status_color: string
}

const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const [products, setProducts] = useState<AdminProductItem[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for filters metadata
  const [metadata, setMetadata] = useState<{
    categories: { id: string; name: string; slug: string }[]
    statuses: { value: string; label: string }[]
  }>({ categories: [], statuses: [] })

  // State for product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [productToEdit, setProductToEdit] = useState<AdminProductItem | null>(null)

  // State for filters
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    keyword: searchParams.get('keyword') || '',
    category_id: searchParams.get('category') || '', // Backend param is category_id (accepts slug)
    status: searchParams.get('status') || '',
  })

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<AdminProductItem | null>(null)

  // Fetch metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await adminService.getProductsMetadata()
        // Normalize categories to have both id and _id if they don't
        const normalizedCategories = data.categories.map((cat: any) => ({
          ...cat,
          _id: cat._id || cat.id,
          id: cat.id || cat._id
        }))
        setMetadata({ ...data, categories: normalizedCategories })
      } catch (error) {
        console.error('Failed to fetch product metadata:', error)
      }
    }
    fetchMetadata()
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      // Prepare filters for API call - ensure status is included even if empty
      const apiFilters = {
        ...filters,
        // Explicitly include status even if empty string (will be cleaned by service)
        status: filters.status || undefined,
      }
      // Call service using filters. backend expects category_id
      const response = await adminService.getProducts(apiFilters)
      // Cast the response products to AdminProductItem[] as we know the shape differs from public Product type
      setProducts(response.products as unknown as AdminProductItem[])
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Failed to fetch products:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách sản phẩm')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showError])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.keyword) params.set('keyword', filters.keyword)
    if (filters.category_id) params.set('category', filters.category_id)
    if (filters.status) params.set('status', filters.status)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await adminService.deleteProduct(productToDelete._id)
      showSuccess('Đã xóa sản phẩm thành công')
      setDeleteModalOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa sản phẩm')
    }
  }

  const handleProductSubmit = async (values: any) => {
    try {
      setIsSubmitting(true)
      if (modalMode === 'add') {
        await adminService.createProduct(values)
        showSuccess('Đã thêm sản phẩm mới thành công')
      } else if (productToEdit) {
        await adminService.updateProduct(productToEdit._id, values)
        showSuccess('Đã cập nhật sản phẩm thành công')
      }
      setIsProductModalOpen(false)
      fetchProducts()
    } catch (error: any) {
      showError(error.response?.data?.message || `Lỗi khi ${modalMode === 'add' ? 'thêm' : 'cập nhật'} sản phẩm`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenEditModal = (product: AdminProductItem) => {
    setModalMode('edit')
    setProductToEdit(product)
    setIsProductModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setModalMode('add')
    setProductToEdit(null)
    setIsProductModalOpen(true)
  }

  const columns: Column<AdminProductItem>[] = [
    {
      key: 'image',
      header: 'Sản phẩm',
      className: 'min-w-[300px]',
      render: (product) => (
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-gray-100 flex-shrink-0 border border-gray-100 dark:border-gray-800 overflow-hidden group">
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-text-main dark:text-white">{product.name}</span>
            <span className="text-xs text-text-sub mt-0.5">SKU: {product.sku?.toUpperCase() || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Danh mục',
      className: 'text-text-sub',
      render: (product) => (
        <span className="text-sm">{product.category_name || 'N/A'}</span>
      ),
    },
    {
      key: 'price',
      header: 'Giá bán',
      sortable: true,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (product) => (
        <span className="font-medium text-text-main dark:text-white">{formatPrice(product.price)}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Kho hàng',
      sortable: true,
      headerClassName: 'text-center',
      className: 'text-center',
      render: (product) => (
        <div>
          <span className={`font-medium ${product.stock_quantity === 0 ? 'text-red-500' : 'text-text-main dark:text-white'}`}>
            {product.stock_quantity || 0}
          </span>
          <span className="text-xs text-text-sub block">
            {product.stock_status === 'out_of_stock' ? 'hết hàng' : product.stock_status === 'low_stock' ? 'sắp hết' : 'trong kho'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'text-center',
      className: 'text-center',
      render: (product) => {
        const colorMap: Record<string, string> = {
          green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
          red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
          yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700',
          blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-700',
          gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
        }

        const dotMap: Record<string, string> = {
          green: 'bg-green-500',
          red: 'bg-red-500',
          yellow: 'bg-yellow-500',
          blue: 'bg-blue-500',
          gray: 'bg-gray-500',
        }

        const badgeClass = colorMap[product.status_color] || colorMap.gray
        const dotClass = dotMap[product.status_color] || dotMap.gray

        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}></span>
            {product.status_label}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: 'Hành động',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (product) => (
        <div className="flex items-center justify-end gap-2">
          <button
            className="p-2 text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Chỉnh sửa"
            onClick={() => handleOpenEditModal(product)}
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            className="p-2 text-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Xóa"
            onClick={() => {
              setProductToDelete(product)
              setDeleteModalOpen(true)
            }}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      ),
    },
  ]

  // Card view render item for mobile
  const renderCardItem = (product: AdminProductItem) => {
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-700',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
    }
    const dotMap: Record<string, string> = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      gray: 'bg-gray-500',
    }

    const badgeClass = colorMap[product.status_color] || colorMap.gray
    const dotClass = dotMap[product.status_color] || dotMap.gray

    return (
      <div key={product.id} className="bg-white dark:bg-[#1a2c32] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-16 rounded-lg bg-gray-100 border border-gray-100 dark:border-gray-800 overflow-hidden">
              <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-text-main dark:text-white line-clamp-2">{product.name}</h3>
              <p className="text-xs text-text-sub mt-1">SKU: {product.sku?.toUpperCase()}</p>
              <p className="text-xs text-text-sub">{product.category_name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-medium text-primary">{formatPrice(product.price)}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${badgeClass}`}>
              <span className={`w-1 h-1 rounded-full mr-1 ${dotClass}`}></span>
              {product.status_label}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-xs text-text-sub">Kho hàng</span>
            <span className={`font-medium text-sm ${product.stock_quantity === 0 ? 'text-red-500' : 'text-text-main dark:text-white'}`}>
              {product.stock_quantity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-text-sub hover:text-primary bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors"
              onClick={() => handleOpenEditModal(product)}
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button
              className="p-2 text-text-sub hover:text-red-500 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors"
              onClick={() => {
                setProductToDelete(product)
                setDeleteModalOpen(true)
              }}
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-main dark:text-white">Quản lý sản phẩm</h2>
            <p className="text-sm text-text-sub mt-1">Quản lý danh sách sản phẩm, kho hàng và giá cả.</p>
          </div>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-sky-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
            onClick={handleOpenAddModal}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm sản phẩm
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1a2c32] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-text-main dark:text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400"
                placeholder="Tìm kiếm tên sản phẩm, mã SKU..."
                type="text"
                value={filters.keyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value, page: 1 }))}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-text-main dark:text-white focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                value={filters.category_id}
                onChange={(e) => setFilters((prev) => ({ ...prev, category_id: e.target.value, page: 1 }))}
              >
                <option value="">Tất cả danh mục</option>
                {metadata.categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-text-main dark:text-white focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="">Tất cả trạng thái</option>
                {metadata.statuses.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop View: Data Table */}
        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={products}
            loading={isLoading}
            emptyMessage="Không có sản phẩm nào"
          />
        </div>

        {/* Mobile View: Card List */}
        <div className="md:hidden flex flex-col gap-4">
          {isLoading ? (
            // Skeleton for mobile
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1a2c32] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm h-40 animate-pulse"></div>
            ))
          ) : products.length > 0 ? (
            products.map(product => renderCardItem(product))
          ) : (
            <div className="text-center py-8 text-text-sub bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800">
              Không có sản phẩm nào
            </div>
          )}
        </div>

        {/* Pagination (shared) */}
        {pagination.total_page > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_page}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setProductToDelete(null)
        }}
        title="Xác nhận xóa"
        size="sm"
      >
        <div className="p-6">
          <p className="text-text-main dark:text-white mb-4">
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{productToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-text-sub dark:text-gray-400 mb-6">
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false)
                setProductToDelete(null)
              }}
            >
              Hủy
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>

      {/* Product Form Modal (Add/Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        initialData={productToEdit}
        categories={metadata.categories as unknown as Category[]}
        isSubmitting={isSubmitting}
        title={modalMode === 'add' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
      />
    </AdminLayout>
  )
}

export default AdminProducts
