import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import OrderCard from '@/components/orders/OrderCard'
import Pagination from '@/components/common/Pagination'
import Select from '@/components/common/Select'
import Skeleton from '@/components/common/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import * as ordersService from '@/services/orders.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import { OrderStatus, Order } from '@/types'

const Orders = () => {
  const { isAuthenticated } = useAuth()
  const { showError } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<{
    page: number
    limit: number
    total_page: number
    total: number
  }>({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
    total: 0,
  })
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>(
    (searchParams.get('status') as OrderStatus) || ''
  )
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  )

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchOrders = async () => {
      setLoading(true)
      try {
        const filters: any = {
          page: currentPage,
          limit: pagination.limit,
        }
        if (statusFilter) {
          filters.status = statusFilter
        }

        const response = await ordersService.getOrders(filters)
        setOrders(response.items)
        setPagination(response.pagination)
      } catch (error: any) {
        console.error('Failed to fetch orders:', error)
        showError(error.response?.data?.message || 'Không thể tải danh sách đơn hàng.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, currentPage, statusFilter, pagination.limit])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 1) {
      params.set('page', currentPage.toString())
    }
    if (statusFilter) {
      params.set('status', statusFilter)
    }
    setSearchParams(params, { replace: true })
  }, [currentPage, statusFilter, setSearchParams])

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as OrderStatus | '')
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Đơn hàng của tôi' },
            ]}
          />

          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">
                Đơn hàng của tôi
              </h1>
              <p className="text-text-sub dark:text-gray-400">
                Xem và quản lý tất cả các đơn đặt hàng của bạn
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-full sm:w-64">
                <Select
                  label="Lọc theo trạng thái"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value={OrderStatus.Pending}>Chờ xử lý</option>
                  <option value={OrderStatus.Processing}>Đang xử lý</option>
                  <option value={OrderStatus.Shipping}>Đang giao hàng</option>
                  <option value={OrderStatus.Completed}>Hoàn thành</option>
                  <option value={OrderStatus.Cancelled}>Đã hủy</option>
                </Select>
              </div>
              {pagination.total_records > 0 && (
                <div className="text-sm text-text-sub dark:text-gray-400">
                  Tìm thấy {pagination.total_records} đơn hàng
                </div>
              )}
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
              <div className="space-y-4 mb-8">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                  shopping_bag
                </span>
                <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                  Chưa có đơn hàng nào
                </h2>
                <p className="text-text-sub dark:text-gray-400 mb-6">
                  {statusFilter
                    ? 'Không tìm thấy đơn hàng với trạng thái này.'
                    : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!'}
                </p>
                {!statusFilter && (
                  <a
                    href={ROUTES.PRODUCTS}
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors font-medium"
                  >
                    Mua sắm ngay
                  </a>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Orders
