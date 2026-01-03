import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import StatsCard from '@/components/admin/StatsCard'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Pagination from '@/components/common/Pagination'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import { formatPrice, formatDate } from '@/utils/formatters'
import { OrderStatus, type Order } from '@/types'

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showError } = useToast()

  const [orders, setOrders] = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState<adminService.OrderStats | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: PAGINATION.DEFAULT_LIMIT,
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    date_from: searchParams.get('start_date') || '',
    date_to: searchParams.get('end_date') || '',
  })

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      // Build filters object, only include non-empty values
      const apiFilters: any = {
        page: filters.page,
        limit: filters.limit,
      }
      if (filters.keyword && filters.keyword.trim()) {
        apiFilters.keyword = filters.keyword.trim()
      }
      if (filters.status && filters.status.trim()) {
        apiFilters.status = filters.status.trim()
      }
      if (filters.date_from && filters.date_from.trim()) {
        apiFilters.date_from = filters.date_from.trim()
      }
      if (filters.date_to && filters.date_to.trim()) {
        apiFilters.date_to = filters.date_to.trim()
      }

      const response = await adminService.getOrders(apiFilters)
      setOrders(response.orders)
      setPagination(response.pagination)
    } catch (error: any) {
      console.error('Failed to fetch orders:', error)
      showError(error.response?.data?.message || 'Không thể tải danh sách đơn hàng')
    } finally {
      setIsLoading(false)
    }
  }, [filters, showError])

  const fetchOrderStats = useCallback(async () => {
    try {
      const stats = await adminService.getOrdersStats()
      setOrderStats(stats)
    } catch (error: any) {
      console.error('Failed to fetch order stats:', error)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    fetchOrderStats()
  }, [fetchOrders, fetchOrderStats])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (filters.keyword) params.set('keyword', filters.keyword)
    if (filters.status) params.set('status', filters.status)
    if (filters.date_from) params.set('start_date', filters.date_from)
    if (filters.date_to) params.set('end_date', filters.date_to)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      processing: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      shipping: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const columns: Column<Order>[] = [
    {
      key: 'order_code',
      header: 'Mã đơn hàng',
      render: (order) => (
        <Link
          to={ROUTES.ORDER_DETAIL(order._id)}
          className="font-medium text-primary hover:underline"
        >
          {order.order_code || order._id}
        </Link>
      ),
    },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (order) => (
        <div>
          <p className="font-medium">{order.shipping_info?.receiver_name || 'N/A'}</p>
          <p className="text-xs text-text-sub dark:text-gray-400">
            {order.shipping_info?.email || order.shipping_info?.phone || ''}
          </p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Ngày đặt',
      sortable: true,
      render: (order) => (
        <span className="text-sm">{formatDate(order.created_at || '')}</span>
      ),
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      sortable: true,
      render: (order) => (
        <span className="font-medium">{formatPrice(order.cost_summary?.total || 0)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (order) => getStatusBadge(order.status),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (order) => (
        <Link
          to={ROUTES.ORDER_DETAIL(order._id)}
          className="text-primary hover:underline text-sm"
        >
          Xem chi tiết
        </Link>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-main dark:text-white mb-6">
            Quản lý đơn hàng
          </h1>

            {/* Stats Cards */}
            {orderStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <StatsCard
                  title="Tổng đơn"
                  value={orderStats.total.toString()}
                  icon="shopping_bag"
                />
                <StatsCard
                  title="Chờ xử lý"
                  value={orderStats.pending.toString()}
                  icon="schedule"
                />
                <StatsCard
                  title="Đang xử lý"
                  value={orderStats.processing.toString()}
                  icon="autorenew"
                />
                <StatsCard
                  title="Đang giao"
                  value={orderStats.shipping.toString()}
                  icon="local_shipping"
                />
                <StatsCard
                  title="Hoàn thành"
                  value={orderStats.completed.toString()}
                  icon="check_circle"
                />
                <StatsCard
                  title="Đã hủy"
                  value={orderStats.cancelled.toString()}
                  icon="cancel"
                />
              </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, keyword: e.target.value, page: 1 }))
                  }
                />
                <Select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                  }
                  options={[
                    { value: '', label: 'Tất cả trạng thái' },
                    { value: 'pending', label: 'Chờ xử lý' },
                    { value: 'processing', label: 'Đang xử lý' },
                    { value: 'shipping', label: 'Đang giao' },
                    { value: 'completed', label: 'Hoàn thành' },
                    { value: 'cancelled', label: 'Đã hủy' },
                  ]}
                />
                <Input
                  type="date"
                  placeholder="Từ ngày"
                  value={filters.date_from}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, date_from: e.target.value, page: 1 }))
                  }
                />
                <Input
                  type="date"
                  placeholder="Đến ngày"
                  value={filters.date_to}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, date_to: e.target.value, page: 1 }))
                  }
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      page: 1,
                      limit: PAGINATION.DEFAULT_LIMIT,
                      keyword: '',
                      status: '',
                      date_from: '',
                      date_to: '',
                    })
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              columns={columns}
              data={orders}
              loading={isLoading}
              emptyMessage="Không có đơn hàng nào"
            />

            {/* Pagination */}
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
        </div>
    </AdminLayout>
  )
}

export default AdminOrders
