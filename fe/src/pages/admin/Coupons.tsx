import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Button from '@/components/common/Button'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import { PAGINATION } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'

interface Coupon {
  _id: string
  code: string
  name?: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  used_count?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
  applicable_to?: 'all' | 'specific_categories' | 'specific_products'
  categories?: string[]
  products?: string[]
  created_at?: string
  updated_at?: string
}

const AdminCoupons = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total: number
    total_page: number
  }>({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for coupon modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null)

  // State for filters
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    code: searchParams.get('code') || '',
    is_active: searchParams.get('is_active') || '',
  })

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: 0,
    min_order_value: 0,
    max_discount: 0,
    usage_limit: 0,
    valid_from: '',
    valid_until: '',
    is_active: true,
    applicable_to: 'all' as 'all' | 'specific_categories' | 'specific_products',
    categories: [] as string[],
    products: [] as string[],
  })

  const fetchCoupons = useCallback(async () => {
    try {
      setIsLoading(true)
      const apiFilters: any = {
        page: filters.page,
        limit: filters.limit,
      }
      if (filters.code) apiFilters.code = filters.code
      if (filters.is_active !== '') apiFilters.is_active = filters.is_active === 'true'

      const response = await adminService.getCoupons(apiFilters)
      setCoupons(response.coupons)
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Failed to fetch coupons:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách mã giảm giá')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showError])

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.code) params.set('code', filters.code)
    if (filters.is_active) params.set('is_active', filters.is_active)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const handleDelete = async () => {
    if (!couponToDelete) return

    try {
      await adminService.deleteCoupon(couponToDelete._id)
      showSuccess('Đã xóa mã giảm giá thành công')
      setDeleteModalOpen(false)
      setCouponToDelete(null)
      fetchCoupons()
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa mã giảm giá')
    }
  }

  const handleCouponSubmit = async () => {
    try {
      setIsSubmitting(true)
      const submitData: any = {
        code: formData.code,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until,
        is_active: formData.is_active,
      }

      if (formData.name) submitData.name = formData.name
      if (formData.description) submitData.description = formData.description
      if (formData.min_order_value > 0) submitData.min_order_value = formData.min_order_value
      if (formData.max_discount > 0) submitData.max_discount = formData.max_discount
      if (formData.usage_limit > 0) submitData.usage_limit = formData.usage_limit
      if (formData.applicable_to !== 'all') {
        submitData.applicable_to = formData.applicable_to
        if (formData.applicable_to === 'specific_categories' && formData.categories.length > 0) {
          submitData.categories = formData.categories
        }
        if (formData.applicable_to === 'specific_products' && formData.products.length > 0) {
          submitData.products = formData.products
        }
      }

      if (modalMode === 'add') {
        await adminService.createCoupon(submitData)
        showSuccess('Đã thêm mã giảm giá mới thành công')
      } else if (couponToEdit) {
        await adminService.updateCoupon(couponToEdit._id, submitData)
        showSuccess('Đã cập nhật mã giảm giá thành công')
      }
      setIsCouponModalOpen(false)
      resetForm()
      fetchCoupons()
    } catch (error: any) {
      showError(error.response?.data?.message || `Lỗi khi ${modalMode === 'add' ? 'thêm' : 'cập nhật'} mã giảm giá`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_value: 0,
      max_discount: 0,
      usage_limit: 0,
      valid_from: '',
      valid_until: '',
      is_active: true,
      applicable_to: 'all',
      categories: [],
      products: [],
    })
    setCouponToEdit(null)
  }

  const handleOpenEditModal = (coupon: Coupon) => {
    setModalMode('edit')
    setCouponToEdit(coupon)
    setFormData({
      code: coupon.code,
      name: coupon.name || '',
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value || 0,
      max_discount: coupon.max_discount || 0,
      usage_limit: coupon.usage_limit || 0,
      valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
      valid_until: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
      is_active: coupon.is_active !== undefined ? coupon.is_active : true,
      applicable_to: coupon.applicable_to || 'all',
      categories: coupon.categories || [],
      products: coupon.products || [],
    })
    setIsCouponModalOpen(true)
  }

  const handleOpenAddModal = () => {
    setModalMode('add')
    resetForm()
    setIsCouponModalOpen(true)
  }

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%${coupon.max_discount ? ` (tối đa ${formatPrice(coupon.max_discount)})` : ''}`
    }
    return formatPrice(coupon.discount_value)
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    const validFrom = new Date(coupon.valid_from)
    const validUntil = new Date(coupon.valid_until)
    const isActive = coupon.is_active !== false

    if (!isActive) {
      return { label: 'Đã tắt', color: 'gray' }
    }
    if (now < validFrom) {
      return { label: 'Chưa bắt đầu', color: 'yellow' }
    }
    if (now > validUntil) {
      return { label: 'Đã hết hạn', color: 'red' }
    }
    if (coupon.usage_limit && coupon.used_count && coupon.used_count >= coupon.usage_limit) {
      return { label: 'Hết lượt', color: 'red' }
    }
    return { label: 'Đang hoạt động', color: 'green' }
  }

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      header: 'Mã giảm giá',
      headerClassName: 'min-w-[180px]',
      cellClassName: 'min-w-[180px]',
      render: (coupon) => (
        <div className="flex flex-col">
          <span className="font-bold text-text-main dark:text-white">{coupon.code}</span>
          {coupon.name && <span className="text-xs text-text-sub mt-0.5">{coupon.name}</span>}
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Giảm giá',
      headerClassName: 'min-w-[150px]',
      cellClassName: 'text-text-sub min-w-[150px]',
      render: (coupon) => (
        <span className="text-sm font-medium text-green-600 dark:text-green-400">{getDiscountDisplay(coupon)}</span>
      ),
    },
    {
      key: 'usage',
      header: 'Sử dụng',
      headerClassName: 'text-center min-w-[100px]',
      cellClassName: 'text-center min-w-[100px]',
      render: (coupon) => (
        <span className="text-sm text-text-main dark:text-white">
          {coupon.used_count || 0}
          {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' / ∞'}
        </span>
      ),
    },
    {
      key: 'validity',
      header: 'Hiệu lực',
      headerClassName: 'w-[180px]',
      cellClassName: 'text-text-sub w-[180px]',
      render: (coupon) => {
        const validFrom = new Date(coupon.valid_from)
        const validUntil = new Date(coupon.valid_until)
        return (
          <div className="text-xs whitespace-nowrap">
            <div>Từ: {validFrom.toLocaleDateString('vi-VN')}</div>
            <div>Đến: {validUntil.toLocaleDateString('vi-VN')}</div>
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'text-center w-[150px]',
      cellClassName: 'text-center w-[150px]',
      render: (coupon) => {
        const status = getStatusBadge(coupon)
        const colorMap: Record<string, string> = {
          green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
          red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
          yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700',
          gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
        }
        const dotMap: Record<string, string> = {
          green: 'bg-green-500',
          red: 'bg-red-500',
          yellow: 'bg-yellow-500',
          gray: 'bg-gray-500',
        }
        const badgeClass = colorMap[status.color] || colorMap.gray
        const dotClass = dotMap[status.color] || dotMap.gray

        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}></span>
              {status.label}
            </span>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      headerClassName: 'text-right w-[130px]',
      cellClassName: 'text-right w-[130px]',
      render: (coupon) => (
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEditModal(coupon)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 whitespace-nowrap"
          >
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCouponToDelete(coupon)
              setDeleteModalOpen(true)
            }}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 whitespace-nowrap"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-main dark:text-white">Quản lý Mã Giảm Giá</h1>
            <p className="text-sm text-text-sub mt-1">Quản lý các mã giảm giá và khuyến mãi</p>
          </div>
          <Button onClick={handleOpenAddModal}>Thêm Mã Giảm Giá</Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Mã giảm giá</label>
              <Input
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value, page: 1 })}
                placeholder="Tìm theo mã..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Trạng thái</label>
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
              >
                <option value="">Tất cả</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã tắt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <DataTable columns={columns} data={coupons} loading={isLoading} />
        </div>

        {/* Pagination */}
        {pagination.total_page > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_page}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isCouponModalOpen}
          onClose={() => {
            setIsCouponModalOpen(false)
            resetForm()
          }}
          title={modalMode === 'add' ? 'Thêm Mã Giảm Giá Mới' : 'Chỉnh Sửa Mã Giảm Giá'}
          size="lg"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                Mã giảm giá <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Ví dụ: SALE2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Tên mã</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tên mã giảm giá (tùy chọn)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Mô tả</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả mã giảm giá (tùy chọn)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Loại giảm giá <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed_amount">Số tiền cố định</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Giá trị giảm giá <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                  placeholder={formData.discount_type === 'percentage' ? '10' : '50000'}
                />
              </div>
            </div>

            {formData.discount_type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Giảm tối đa (VNĐ)</label>
                <Input
                  type="number"
                  value={formData.max_discount}
                  onChange={(e) => setFormData({ ...formData, max_discount: parseFloat(e.target.value) || 0 })}
                  placeholder="0 = không giới hạn"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Đơn hàng tối thiểu (VNĐ)</label>
                <Input
                  type="number"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) || 0 })}
                  placeholder="0 = không yêu cầu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Giới hạn sử dụng</label>
                <Input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || 0 })}
                  placeholder="0 = không giới hạn"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Ngày kết thúc <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Trạng thái</label>
              <select
                value={formData.is_active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-main dark:text-white"
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã tắt</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCouponModalOpen(false)
                  resetForm()
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCouponSubmit}
                disabled={isSubmitting || !formData.code || !formData.discount_value || !formData.valid_from || !formData.valid_until}
              >
                {isSubmitting ? 'Đang xử lý...' : modalMode === 'add' ? 'Thêm Mã' : 'Cập nhật'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setCouponToDelete(null)
          }}
          title="Xác nhận xóa"
        >
          <div className="space-y-4">
            <p className="text-text-main dark:text-white">
              Bạn có chắc chắn muốn xóa mã giảm giá <strong>{couponToDelete?.code}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false)
                  setCouponToDelete(null)
                }}
              >
                Hủy
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminCoupons

