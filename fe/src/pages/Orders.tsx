import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import OrderCard from '@/components/orders/OrderCard'
import Pagination from '@/components/common/Pagination'
import Skeleton from '@/components/common/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import * as ordersService from '@/services/orders.service'
import { ROUTES, PAGINATION } from '@/utils/constants'
import { OrderStatus, Order } from '@/types'

const STATUS_FILTERS = [
  { value: '', label: 'Tất cả', icon: 'inventory_2' },
  { value: OrderStatus.Pending, label: 'Chờ xử lý', icon: 'schedule' },
  { value: OrderStatus.Processing, label: 'Đang xử lý', icon: 'autorenew' },
  { value: OrderStatus.Shipping, label: 'Đang giao', icon: 'local_shipping' },
  { value: OrderStatus.Completed, label: 'Hoàn thành', icon: 'check_circle' },
  { value: OrderStatus.Cancelled, label: 'Đã hủy', icon: 'cancel' },
]

const Orders = () => {
  const { isAuthenticated } = useAuth()
  const { showError } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
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
  }, [isAuthenticated, currentPage, statusFilter, pagination.limit, refreshTrigger])

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
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOrderCancelled = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Đơn hàng của tôi' },
            ]}
          />

          <div className="mt-6 sm:mt-8">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-2">
                Đơn hàng của tôi
              </h1>
              <p className="text-sm sm:text-base text-text-sub dark:text-gray-400">
                Xem và quản lý tất cả các đơn đặt hàng của bạn
              </p>
            </div>

            {/* Status Filter */}
            <div className="mb-6 sm:mb-8">
              {/* Mobile: Dropdown */}
              <div className="lg:hidden">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-medium text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2c32] text-text-main dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {STATUS_FILTERS.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop: Flex wrap */}
              <div className="hidden lg:flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => {
                  const isActive = statusFilter === filter.value
                  return (
                    <button
                      key={filter.value}
                      onClick={() => handleStatusFilterChange(filter.value)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                        ${
                          isActive
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white dark:bg-[#1a2c32] text-text-main dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary'
                        }
                      `}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {filter.icon}
                      </span>
                      <span>{filter.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Results count */}
              {pagination.total > 0 && (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-text-sub dark:text-gray-400">
                  Tìm thấy <span className="font-semibold text-text-main dark:text-white">{pagination.total}</span> đơn hàng
                </div>
              )}
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {orders.map((order) => (
                  <OrderCard 
                    key={order._id} 
                    order={order}
                    onOrderCancelled={handleOrderCancelled}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12 md:p-16 text-center shadow-sm">
                <div className="max-w-md mx-auto">
                  <span className="material-symbols-outlined text-6xl sm:text-7xl text-gray-300 dark:text-gray-600 mb-4 sm:mb-6 block">
                    shopping_bag
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-main dark:text-white mb-2 sm:mb-3">
                    Chưa có đơn hàng nào
                  </h2>
                  <p className="text-sm sm:text-base text-text-sub dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed px-4">
                    {statusFilter
                      ? 'Không tìm thấy đơn hàng với trạng thái này.'
                      : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!'}
                  </p>
                  {!statusFilter && (
                    <a
                      href={ROUTES.PRODUCTS}
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg font-bold text-base sm:text-lg min-h-[44px]"
                    >
                      <span className="material-symbols-outlined">storefront</span>
                      <span>Khám phá sản phẩm</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination.total_page > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.total_page}
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