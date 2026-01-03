import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import RatingDisplay from '@/components/review/RatingDisplay'
import { useToast } from '@/contexts/ToastContext'
import { getAllReviews, moderateReview } from '@/services/reviews.service'
import { getCategories } from '@/services/categories.service'
import { PAGINATION } from '@/utils/constants'
import { formatDate } from '@/utils/formatters'
import type { Review } from '@/types/review.types'
import type { Category } from '@/types'

interface AdminReview extends Review {
  product?: {
    _id: string
    name: string
    slug: string
    image?: string
    category?: string | {
      _id: string
      name?: string
      slug?: string
    }
  }
}

const AdminReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()

  const [allReviews, setAllReviews] = useState<AdminReview[]>([])
  const [filteredReviews, setFilteredReviews] = useState<AdminReview[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    status: (searchParams.get('status') as 'approved' | 'rejected' | '') || '',
    category_id: searchParams.get('category_id') || '',
    product_name: searchParams.get('product_name') || '',
    rating: searchParams.get('rating') || '',
    date_from: searchParams.get('date_from') || '',
    date_to: searchParams.get('date_to') || '',
  })
  const [moderateModalOpen, setModerateModalOpen] = useState(false)
  const [reviewToModerate, setReviewToModerate] = useState<AdminReview | null>(null)
  const [newStatus, setNewStatus] = useState<'approved' | 'rejected'>('approved')
  const [isModerating, setIsModerating] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch all reviews (we'll filter on frontend)
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      // Fetch with large limit to get all reviews for filtering
      const params: any = {
        page: 1,
        limit: 1000, // Large limit to get all reviews
      }
      if (filters.status) params.status = filters.status

      const response = await getAllReviews(params)
      setAllReviews(response.reviews as AdminReview[])
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách đánh giá')
    } finally {
      setIsLoading(false)
    }
  }, [filters.status, showError])

  // Filter reviews based on filters
  useEffect(() => {
    let filtered = [...allReviews]

    // Filter by status (already done by backend, but keep for consistency)
    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status)
    }

    // Filter by category
    if (filters.category_id) {
      filtered = filtered.filter((r) => {
        const productCategory = r.product?.category
        if (!productCategory) return false
        // Handle both object and string ID
        if (typeof productCategory === 'string') {
          return productCategory === filters.category_id
        }
        // Handle object with _id
        const categoryId = productCategory._id?.toString() || (productCategory._id as any)?.toString?.() || String(productCategory._id)
        return categoryId === filters.category_id
      })
    }

    // Filter by product name
    if (filters.product_name) {
      const searchTerm = filters.product_name.toLowerCase()
      filtered = filtered.filter((r) =>
        r.product?.name?.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by rating
    if (filters.rating) {
      const rating = parseInt(filters.rating)
      filtered = filtered.filter((r) => r.rating === rating)
    }

    // Filter by date range
    if (filters.date_from) {
      const fromDate = new Date(filters.date_from)
      fromDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((r) => {
        const reviewDate = new Date(r.created_at)
        return reviewDate >= fromDate
      })
    }
    if (filters.date_to) {
      const toDate = new Date(filters.date_to)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((r) => {
        const reviewDate = new Date(r.created_at)
        return reviewDate <= toDate
      })
    }

    // Sort by created_at descending (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })

    // Pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / filters.limit)
    const startIndex = (filters.page - 1) * filters.limit
    const endIndex = startIndex + filters.limit
    const paginatedReviews = filtered.slice(startIndex, endIndex)

    setFilteredReviews(paginatedReviews)
    setPagination({
      page: filters.page,
      limit: filters.limit,
      total_page: totalPages,
      total,
    })
  }, [allReviews, filters])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.status) params.set('status', filters.status)
    if (filters.category_id) params.set('category_id', filters.category_id)
    if (filters.product_name) params.set('product_name', filters.product_name)
    if (filters.rating) params.set('rating', filters.rating)
    if (filters.date_from) params.set('date_from', filters.date_from)
    if (filters.date_to) params.set('date_to', filters.date_to)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const handleModerate = async () => {
    if (!reviewToModerate) return

    try {
      setIsModerating(true)
      await moderateReview(reviewToModerate._id, newStatus)
      showSuccess(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá thành công`)
      setModerateModalOpen(false)
      setReviewToModerate(null)
      fetchReviews()
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể cập nhật trạng thái đánh giá')
    } finally {
      setIsModerating(false)
    }
  }

  const handleOpenModerateModal = (review: AdminReview, status: 'approved' | 'rejected') => {
    setReviewToModerate(review)
    setNewStatus(status)
    setModerateModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      approved: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      rejected: { label: 'Đã từ chối', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const columns: Column<AdminReview>[] = [
    {
      key: 'user',
      header: 'Người đánh giá',
      render: (review) => (
        <div className="flex items-center gap-3">
          {review.user?.avatar_url ? (
            <img
              src={review.user.avatar_url}
              alt={review.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-sm">{review.user?.name || 'Người dùng'}</p>
            <p className="text-xs text-text-sub dark:text-gray-400">{review.user?.email || ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Sản phẩm',
      render: (review) => (
        <div>
          <p className="font-medium text-sm">{review.product?.name || 'N/A'}</p>
          {review.product?.slug && (
            <p className="text-xs text-text-sub dark:text-gray-400">ID: {review.product._id}</p>
          )}
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Đánh giá',
      render: (review) => (
        <div className="flex items-center gap-2">
          <RatingDisplay rating={review.rating} size="sm" />
          <span className="text-sm text-text-sub dark:text-gray-400">({review.rating}/5)</span>
        </div>
      ),
    },
    {
      key: 'comment',
      header: 'Bình luận',
      render: (review) => (
        <div className="max-w-xs">
          <p className="text-sm line-clamp-2">{review.comment || 'Không có bình luận'}</p>
          {review.images && review.images.length > 0 && (
            <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
              {review.images.length} ảnh
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (review) => getStatusBadge(review.status),
    },
    {
      key: 'created_at',
      header: 'Ngày tạo',
      render: (review) => (
        <span className="text-sm">{formatDate(review.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (review) => (
        <div className="flex items-center gap-2">
          {review.status === 'approved' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenModerateModal(review, 'rejected')}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Từ chối
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenModerateModal(review, 'approved')}
              className="text-green-600 hover:text-green-700 dark:text-green-400"
            >
              Duyệt
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">Quản lý đánh giá</h1>
          <p className="text-text-sub dark:text-gray-400">Duyệt và quản lý đánh giá sản phẩm từ khách hàng</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-main dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              Bộ lọc
            </h3>
            {(filters.status || filters.category_id || filters.product_name || filters.rating || filters.date_from || filters.date_to) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    page: 1,
                    limit: PAGINATION.DEFAULT_LIMIT,
                    status: '',
                    category_id: '',
                    product_name: '',
                    rating: '',
                    date_from: '',
                    date_to: '',
                  })
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <span className="material-symbols-outlined text-sm mr-1">close</span>
                Xóa bộ lọc
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Row 1: Product filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Select
                  label="Danh mục sản phẩm"
                  value={filters.category_id}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                      page: 1,
                    }))
                  }
                  options={[
                    { value: '', label: 'Tất cả danh mục' },
                    ...categories.map((cat) => ({
                      value: cat._id || '',
                      label: cat.name || '',
                    })),
                  ]}
                />
              </div>
              <div>
                <Input
                  label="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm để tìm..."
                  value={filters.product_name}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      product_name: e.target.value,
                      page: 1,
                    }))
                  }
                />
              </div>
              <div>
                <Select
                  label="Đánh giá"
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: e.target.value,
                      page: 1,
                    }))
                  }
                  options={[
                    { value: '', label: 'Tất cả đánh giá' },
                    { value: '5', label: '⭐⭐⭐⭐⭐ 5 sao' },
                    { value: '4', label: '⭐⭐⭐⭐ 4 sao' },
                    { value: '3', label: '⭐⭐⭐ 3 sao' },
                    { value: '2', label: '⭐⭐ 2 sao' },
                    { value: '1', label: '⭐ 1 sao' },
                  ]}
                />
              </div>
            </div>

            {/* Row 2: Date and Status filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Từ ngày"
                  type="date"
                  value={filters.date_from}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      date_from: e.target.value,
                      page: 1,
                    }))
                  }
                />
              </div>
              <div>
                <Input
                  label="Đến ngày"
                  type="date"
                  value={filters.date_to}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      date_to: e.target.value,
                      page: 1,
                    }))
                  }
                />
              </div>
              <div>
                <Select
                  label="Trạng thái"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value as 'approved' | 'rejected' | '',
                      page: 1,
                    }))
                  }
                  options={[
                    { value: '', label: 'Tất cả trạng thái' },
                    { value: 'approved', label: '✅ Đã duyệt' },
                    { value: 'rejected', label: '❌ Đã từ chối' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <DataTable
            columns={columns}
            data={filteredReviews}
            loading={isLoading}
            emptyMessage="Không có đánh giá nào"
          />
        </div>

        {/* Pagination */}
        {pagination.total_page > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_page}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        )}

        {/* Moderate Modal */}
        <Modal
          isOpen={moderateModalOpen}
          onClose={() => {
            setModerateModalOpen(false)
            setReviewToModerate(null)
          }}
          title={newStatus === 'approved' ? 'Duyệt đánh giá' : 'Từ chối đánh giá'}
        >
          <div className="space-y-4">
            <p className="text-text-main dark:text-white">
              Bạn có chắc chắn muốn {newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá này?
            </p>
            {reviewToModerate && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Người đánh giá:</span>
                  <span className="text-sm">{reviewToModerate.user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sản phẩm:</span>
                  <span className="text-sm">{reviewToModerate.product?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Đánh giá:</span>
                  <RatingDisplay rating={reviewToModerate.rating} size="sm" />
                </div>
                {reviewToModerate.comment && (
                  <div>
                    <span className="text-sm font-medium">Bình luận:</span>
                    <p className="text-sm text-text-sub dark:text-gray-400 mt-1">
                      {reviewToModerate.comment}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setModerateModalOpen(false)
                  setReviewToModerate(null)
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleModerate} disabled={isModerating} isLoading={isModerating}>
                {newStatus === 'approved' ? 'Duyệt' : 'Từ chối'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminReviews

