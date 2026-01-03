import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable, { Column } from '@/components/admin/DataTable'
import StatsCard from '@/components/admin/StatsCard'
import UpdateOrderStatusModal from '@/components/admin/UpdateOrderStatusModal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Pagination from '@/components/common/Pagination'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import { formatPrice, formatDate, formatDateShort, formatPriceSimple } from '@/utils/formatters'
import { OrderStatus, type Order } from '@/types'

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showError, showSuccess, showInfo } = useToast()

  const [orders, setOrders] = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState<adminService.OrderStats | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false)
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState<Order | null>(null)
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
      setPagination({
        ...response.pagination,
        total: response.pagination.total || 0,
      })
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

  const handleOpenUpdateStatusModal = (order: Order) => {
    setSelectedOrderForUpdate(order)
    setIsUpdateStatusModalOpen(true)
  }

  const handleCloseUpdateStatusModal = () => {
    setIsUpdateStatusModalOpen(false)
    setSelectedOrderForUpdate(null)
  }

  const handleUpdateStatusSuccess = () => {
    // Refresh orders list
    fetchOrders()
    // Refresh stats
    fetchOrderStats()
  }

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

  const handleExportExcel = async () => {
    try {
      setIsLoading(true)
      showInfo('Đang tải dữ liệu để xuất Excel...')

      // Fetch all orders with current filters but without pagination limit
      const response = await adminService.getOrders({
        ...filters,
        page: 1,
        limit: 10000, // Large limit to get all data
      })

      if (response.orders.length === 0) {
        showError('Không có dữ liệu để xuất Excel')
        return
      }

      // Format data for Excel export
      const exportData = response.orders.map((order: any) => ({
        'Mã đơn hàng': order.order_code || order._id,
        'Khách hàng': order.customer?.name || order.shipping_info?.receiver_name || 'N/A',
        'Email': order.customer?.email || order.shipping_info?.email || '',
        'Số điện thoại': order.shipping_info?.phone || '',
        'Sản phẩm': order.product_summary || '',
        'Ngày đặt': order.created_at_display || formatDateShort(order.created_at || ''),
        'Giờ đặt': order.created_time_display || '',
        'Tổng tiền (VNĐ)': formatPriceSimple(order.total || order.cost_summary?.total || 0),
        'Thanh toán': order.payment_status_label || (order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'),
        'Trạng thái': order.status_label || order.status,
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths for better readability
      const colWidths = [
        { wch: 18 }, // Mã đơn hàng
        { wch: 25 }, // Khách hàng
        { wch: 30 }, // Email
        { wch: 15 }, // Số điện thoại
        { wch: 30 }, // Sản phẩm
        { wch: 15 }, // Ngày đặt
        { wch: 12 }, // Giờ đặt
        { wch: 20 }, // Tổng tiền
        { wch: 15 }, // Thanh toán
        { wch: 15 }, // Trạng thái
      ]
      ws['!cols'] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đơn hàng')

      // Generate filename with current date and time
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-')
      const filename = `Danh_sach_don_hang_${dateStr}_${timeStr}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      showSuccess(`Đã xuất file Excel thành công: ${filename} (${exportData.length} đơn hàng)`)
    } catch (error: any) {
      console.error('Export Excel error:', error)
      showError(error.response?.data?.message || 'Không thể xuất file Excel')
    } finally {
      setIsLoading(false)
    }
  }


  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' },
      processing: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' },
      shipping: { label: 'Đang giao', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' },
      completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' },
      cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const getPaymentBadge = (order: any) => {
    const isPaid = order.payment_status === 'paid' || (order.shipping_info?.payment_method && !order.shipping_info.payment_method.toLowerCase().includes('cod'))
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${
        isPaid
          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-100 dark:border-green-800/30'
          : 'bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400 border-gray-200 dark:border-gray-700'
      }`}>
        <span className={`size-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
      </span>
    )
  }

  const getCustomerAvatar = (order: any) => {
    const avatarUrl = order.customer?.avatar_url
    const name = order.customer?.name || order.shipping_info?.receiver_name || 'N/A'
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

    if (avatarUrl) {
      return (
        <div className="size-8 rounded-full bg-gray-200 overflow-hidden">
          <img className="w-full h-full object-cover" src={avatarUrl} alt={name} />
        </div>
      )
    }
    return (
      <div className="size-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs font-bold">
        {initials}
      </div>
    )
  }

  const columns: Column<Order>[] = [
    {
      key: 'stt',
      header: 'STT',
      headerClassName: 'w-16 text-center',
      cellClassName: 'w-16 text-center',
      render: (_order, index) => {
        const page = Number(pagination.page) || 1
        const limit = Number(pagination.limit) || PAGINATION.DEFAULT_LIMIT
        const idx = typeof index === 'number' ? index : 0
        const stt = (page - 1) * limit + idx + 1
        return <span className="text-text-sub dark:text-gray-400 font-medium">{isNaN(stt) ? '-' : String(stt)}</span>
      },
    },
    {
      key: 'order_code',
      header: 'Mã đơn hàng',
      render: (order: any) => (
        <span className="font-bold text-primary hover:underline cursor-pointer">
          {order.order_code || `#ORD-${(order._id || order.id || '').slice(-4).toUpperCase()}`}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Khách hàng',
      render: (order: any) => (
        <div className="flex items-center gap-3">
          {getCustomerAvatar(order)}
          <div>
            <div className="font-medium text-text-main dark:text-white">
              {order.customer?.name || order.shipping_info?.receiver_name || 'N/A'}
            </div>
            <div className="text-xs text-text-sub dark:text-gray-400">
              {order.customer?.email || order.shipping_info?.email || ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'products',
      header: 'Sản phẩm',
      render: (order: any) => (
        <div>
          <div className="text-text-main dark:text-white">{order.product_summary || 'N/A'}</div>
          {order.product_more_count > 0 && (
            <div className="text-xs text-text-sub text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px]">
              + {order.product_more_count} sản phẩm khác
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Ngày đặt',
      render: (order: any) => (
        <div className="text-text-sub dark:text-gray-400">
          <div>{order.created_at_display || formatDateShort(order.created_at || '')}</div>
          <div className="text-xs text-gray-400">{order.created_time_display || ''}</div>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Tổng tiền',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (order: any) => (
        <span className="font-bold text-text-main dark:text-white">
          {order.total_display || formatPrice(order.total || order.cost_summary?.total || 0)}
        </span>
      ),
    },
    {
      key: 'payment',
      header: 'Thanh toán',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (order: any) => getPaymentBadge(order),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (order) => getStatusBadge(order.status),
    },
    {
      key: 'actions',
      header: 'Hành động',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: (order: any) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
            title="Xem chi tiết"
            onClick={() => window.open(ROUTES.ORDER_DETAIL(order._id || order.id), '_blank')}
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          <button
            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded transition-colors"
            title="Cập nhật trạng thái"
            onClick={() => handleOpenUpdateStatusModal(order)}
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-main dark:text-white">Quản lý Đơn hàng</h2>
              <p className="text-text-sub dark:text-gray-400 text-sm mt-1">Xem và quản lý tất cả các đơn đặt hàng</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExportExcel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                Xuất Excel
              </Button>
            </div>
          </div>

            {/* Stats Cards - 4 cards only */}
            {orderStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Tổng đơn hàng"
                  value={orderStats.total.toString()}
                  icon="list_alt"
                  iconBgColor="blue"
                />
                <StatsCard
                  title="Chờ xử lý"
                  value={orderStats.pending.toString()}
                  icon="pending_actions"
                  iconBgColor="orange"
                />
                <StatsCard
                  title="Đang giao"
                  value={orderStats.shipping.toString()}
                  icon="local_shipping"
                  iconBgColor="purple"
                />
                <StatsCard
                  title="Đã hủy"
                  value={orderStats.cancelled.toString()}
                  icon="cancel"
                  iconBgColor="green"
                />
              </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, status: '', page: 1 }))}
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      filters.status === ''
                        ? 'text-white bg-primary'
                        : 'text-text-sub dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, status: 'pending', page: 1 }))}
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      filters.status === 'pending'
                        ? 'text-white bg-primary'
                        : 'text-text-sub dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Chờ xử lý
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, status: 'shipping', page: 1 }))}
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      filters.status === 'shipping'
                        ? 'text-white bg-primary'
                        : 'text-text-sub dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Đang giao
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, status: 'completed', page: 1 }))}
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      filters.status === 'completed'
                        ? 'text-white bg-primary'
                        : 'text-text-sub dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Hoàn thành
                  </button>
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, status: 'cancelled', page: 1 }))}
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      filters.status === 'cancelled'
                        ? 'text-white bg-primary'
                        : 'text-text-sub dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Đã hủy
                  </button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">calendar_month</span>
                    <Input
                      type="date"
                      className="w-full pl-9 pr-4 py-2"
                      placeholder="Lọc theo ngày"
                      value={filters.date_from || ''}
                      onChange={(e) => setFilters((prev) => ({ ...prev, date_from: e.target.value, page: 1 }))}
                    />
                  </div>
                  <button
                    className="p-2 text-text-sub hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                    title="Bộ lọc nâng cao"
                  >
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={orders}
                  loading={isLoading}
                  emptyMessage="Không có đơn hàng nào"
                />
              </div>
              {pagination.total > 0 && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="text-sm text-text-sub dark:text-gray-400">
                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} trong số {pagination.total} đơn hàng
                  </div>
                  {pagination.total_page > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-text-sub dark:text-gray-300 transition-colors disabled:opacity-50"
                      >
                        Trước
                      </button>
                      {Array.from({ length: Math.min(5, pagination.total_page) }, (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => setFilters((prev) => ({ ...prev, page }))}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              pagination.page === page
                                ? 'bg-primary text-white hover:bg-primary/90'
                                : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-text-sub dark:text-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                      {pagination.total_page > 5 && <span className="px-2 text-text-sub">...</span>}
                      {pagination.total_page > 5 && (
                        <button
                          onClick={() => setFilters((prev) => ({ ...prev, page: pagination.total_page }))}
                          className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-text-sub dark:text-gray-300 transition-colors"
                        >
                          {pagination.total_page}
                        </button>
                      )}
                      <button
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.total_page}
                        className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-text-sub dark:text-gray-300 transition-colors disabled:opacity-50"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>

        {/* Update Order Status Modal */}
        {selectedOrderForUpdate && (
          <UpdateOrderStatusModal
            isOpen={isUpdateStatusModalOpen}
            onClose={handleCloseUpdateStatusModal}
            order={{
              _id: selectedOrderForUpdate._id || selectedOrderForUpdate.id || '',
              order_code: (selectedOrderForUpdate as any).order_code || '',
              status: selectedOrderForUpdate.status,
            }}
            onSuccess={handleUpdateStatusSuccess}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
