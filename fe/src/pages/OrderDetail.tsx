import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import OrderItem from '@/components/orders/OrderItem'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import * as ordersService from '@/services/orders.service'
import { ROUTES } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'
import { OrderStatus, type Order } from '@/types'

const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    case OrderStatus.Processing:
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    case OrderStatus.Shipping:
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
    case OrderStatus.Completed:
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    case OrderStatus.Cancelled:
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
  }
}

const getStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang xử lý'
    case OrderStatus.Shipping:
      return 'Đang giao hàng'
    case OrderStatus.Completed:
      return 'Hoàn thành'
    case OrderStatus.Cancelled:
      return 'Đã hủy'
    default:
      return status
  }
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Không tìm thấy mã đơn hàng')
        setLoading(false)
        return
      }

      try {
        const orderData = await ordersService.getOrderDetail(orderId)
        setOrder(orderData)
      } catch (err: any) {
        console.error('Failed to fetch order:', err)
        if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng')
        } else {
          setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)'
      case 'credit_card':
        return 'Thẻ tín dụng / Ghi nợ quốc tế'
      case 'ewallet':
        return 'Ví điện tử'
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng'
      default:
        return method
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-red-400 dark:text-red-500 mb-4">
              error
            </span>
            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
              {error || 'Không tìm thấy đơn hàng'}
            </h2>
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => navigate(ROUTES.ORDERS)}>Quay lại danh sách đơn hàng</Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.HOME)}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: ROUTES.HOME },
              { label: 'Đơn hàng của tôi', path: ROUTES.ORDERS },
              { label: 'Chi tiết đơn hàng' },
            ]}
          />

          <div className="mt-8">
            {/* Order Header */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    Đơn hàng {order.order_code}
                  </h1>
                  <p className="text-sm text-text-sub dark:text-gray-400">
                    Đặt hàng ngày {formatDate(order.created_at)}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Sản phẩm ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                  >
                    <OrderItem item={item} showLink={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            {order.shipping_info && (
              <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">
                  Thông tin giao hàng
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="text-text-main dark:text-white">
                    <span className="font-medium">Người nhận:</span> {order.shipping_info.receiver_name}
                  </p>
                  <p className="text-text-main dark:text-white">
                    <span className="font-medium">Số điện thoại:</span> {order.shipping_info.phone}
                  </p>
                  <p className="text-text-main dark:text-white">
                    <span className="font-medium">Email:</span> {order.shipping_info.email}
                  </p>
                  <p className="text-text-main dark:text-white">
                    <span className="font-medium">Địa chỉ:</span> {order.shipping_info.address}
                  </p>
                  <p className="text-text-main dark:text-white">
                    <span className="font-medium">Phương thức thanh toán:</span>{' '}
                    {getPaymentMethodLabel(order.shipping_info.payment_method)}
                  </p>
                  {order.shipping_info.estimated_delivery && (
                    <p className="text-text-main dark:text-white">
                      <span className="font-medium">Thời gian giao hàng dự kiến:</span>{' '}
                      {order.shipping_info.estimated_delivery}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Cost Summary */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-text-sub dark:text-gray-400">Tạm tính</span>
                  <span className="font-medium text-text-main dark:text-white">
                    {formatPrice(order.cost_summary.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-text-sub dark:text-gray-400">Phí vận chuyển</span>
                  <span className="font-medium text-text-main dark:text-white">
                    {formatPrice(order.cost_summary.shipping_fee)}
                  </span>
                </div>
                {order.cost_summary.discount_amount > 0 && (
                  <div className="flex justify-between text-base text-green-600 dark:text-green-400">
                    <span>Giảm giá</span>
                    <span className="font-medium">-{formatPrice(order.cost_summary.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <span className="text-lg font-bold text-text-main dark:text-white">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(order.cost_summary.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Note */}
            {order.note && (
              <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-xl font-bold text-text-main dark:text-white mb-4">Ghi chú</h2>
                <p className="text-text-main dark:text-white">{order.note}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate(ROUTES.ORDERS)} variant="outline">
                Quay lại danh sách đơn hàng
              </Button>
              <Button onClick={() => navigate(ROUTES.HOME)}>Tiếp tục mua sắm</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderDetail
