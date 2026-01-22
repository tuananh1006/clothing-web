import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { ROUTES } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'
import AddressDisplay from '@/components/common/AddressDisplay'
import api from '@/services/api'
import { API_ENDPOINTS } from '@/utils/constants'
import type { ApiResponse, Order } from '@/types'

const OrderSuccess = () => {
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
        const response = await api.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.DETAIL(orderId))
        setOrder(response.data.data)
      } catch (err: any) {
        console.error('Failed to fetch order:', err)
        setError(err.response?.data?.message || 'Không thể tải thông tin đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

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
              <Button onClick={() => navigate(ROUTES.HOME)}>Về trang chủ</Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.ORDERS)}>
                Xem đơn hàng của tôi
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
              { label: 'Đặt hàng thành công' },
            ]}
          />

          <div className="mt-8">
            {/* Success Message */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
                  <span className="material-symbols-outlined text-6xl text-green-600 dark:text-green-400">
                    check_circle
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-text-main dark:text-white mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-text-sub dark:text-gray-400 mb-6">
                Cảm ơn bạn đã mua sắm tại YORI. Đơn hàng của bạn đã được tiếp nhận.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 inline-block">
                <p className="text-sm text-text-sub dark:text-gray-400 mb-1">Mã đơn hàng</p>
                <p className="text-xl font-bold text-primary">{order.order_code}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Thông tin đơn hàng
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-text-main dark:text-white mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      {item.variant_text && (
                        <p className="text-sm text-text-sub dark:text-gray-400 mb-2">
                          {item.variant_text}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-text-sub dark:text-gray-400">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-base font-semibold text-text-main dark:text-white">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
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

            {/* Shipping Info */}
            {order.shipping_info && (
              <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
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
                    <span className="font-medium">Địa chỉ:</span>{' '}
                    <AddressDisplay addressString={order.shipping_info.address} />
                  </p>
                  <p className="text-text-main dark:text-white">
                    <span className="font-medium">Phương thức thanh toán:</span>{' '}
                    {order.shipping_info.payment_method === 'cod'
                      ? 'Thanh toán khi nhận hàng (COD)'
                      : order.shipping_info.payment_method === 'credit_card'
                      ? 'Thẻ tín dụng / Ghi nợ quốc tế'
                      : order.shipping_info.payment_method === 'ewallet'
                      ? 'Ví điện tử'
                      : order.shipping_info.payment_method === 'bank_transfer'
                      ? 'Chuyển khoản ngân hàng'
                      : order.shipping_info.payment_method}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(ROUTES.ORDER_DETAIL(order._id))}
                className="w-full sm:w-auto"
              >
                Xem chi tiết đơn hàng
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.HOME)}
                className="w-full sm:w-auto"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrderSuccess
