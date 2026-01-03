import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice, formatDate } from '@/utils/formatters'
import { ROUTES } from '@/utils/constants'
import { OrderStatus, type Order } from '@/types'
import * as ordersService from '@/services/orders.service'
import { useToast } from '@/contexts/ToastContext'
import { useCart } from '@/contexts/CartContext'
import Button from '@/components/common/Button'

interface OrderCardProps {
  order: Order
  onOrderCancelled?: () => void
}

const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return {
        label: 'Chờ xử lý',
        className:
          'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800',
      }
    case OrderStatus.Processing:
      return {
        label: 'Đang xử lý',
        className:
          'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800',
      }
    case OrderStatus.Shipping:
      return {
        label: 'Đang giao hàng',
        className:
          'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800',
      }
    case OrderStatus.Completed:
      return {
        label: 'Hoàn thành',
        className:
          'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-800',
      }
    case OrderStatus.Cancelled:
      return {
        label: 'Đã hủy',
        className:
          'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-800',
      }
    default:
      return {
        label: status,
        className:
          'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-100 dark:border-gray-700',
      }
  }
}

const OrderCard = ({ order, onOrderCancelled }: OrderCardProps) => {
  const statusConfig = getStatusConfig(order.status)
  const { showSuccess, showError } = useToast()
  const { clearCart, addToCart } = useCart()
  const navigate = useNavigate()

  /* ===== Cancel dialog (NGUYÊN BẢN) ===== */
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  /* ===== Reorder dialog ===== */
  const [showReorderDialog, setShowReorderDialog] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  const handleConfirmCancel = async () => {
    setIsCancelling(true)
    try {
      await ordersService.cancelOrder(order._id)
      showSuccess('Hủy đơn hàng thành công!')
      setShowCancelDialog(false)
      onOrderCancelled?.()
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.')
    } finally {
      setIsCancelling(false)
    }
  }

  const handleConfirmReorder = async () => {
    setIsReordering(true)
    try {
      clearCart()
      for (const item of order.items) {
        await addToCart({
          product_id: item.product_id,
          buy_count: item.quantity,
        })
      }
      showSuccess('Đã đưa sản phẩm vào giỏ hàng')
      setShowReorderDialog(false)
      navigate(ROUTES.CHECKOUT)
    } catch {
      showError('Không thể đặt lại đơn hàng')
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <>
      {/* ===== CARD ===== */}
      <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Link
                to={ROUTES.ORDER_DETAIL(order._id)}
                className="text-lg md:text-xl font-bold text-text-main dark:text-white hover:text-primary transition-colors"
              >
                {order.order_code}
              </Link>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-sub dark:text-gray-400">Tổng thanh toán</p>
              <p className="text-lg font-black text-primary">
                {formatPrice(order.cost_summary.total)}
              </p>
            </div>
          </div>
          <p className="text-text-sub dark:text-gray-400 text-xs mt-2">
            Đặt ngày {formatDate(order.created_at || '')}
          </p>
        </div>

        {/* Products */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-24 h-28 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border">
                  {item.thumbnail_url ? (
                    <img
                      src={item.thumbnail_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">
                        image
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-text-main dark:text-white">
                      {item.name}
                    </h4>
                    {item.variant_text && (
                      <p className="text-xs text-text-sub dark:text-gray-400">
                        {item.variant_text}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-text-sub dark:text-gray-400">
                      SL: {item.quantity}
                    </span>
                    <span className="font-bold text-text-main dark:text-white">
                      {formatPrice(item.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            {/* Xem chi tiết */}
            <Button
              className="flex-1"
              onClick={() => navigate(ROUTES.ORDER_DETAIL(order._id))}
            >
              Xem chi tiết
            </Button>

            {/* Hủy đơn – GIỮ MÀU ĐỎ */}
            {(order.status === OrderStatus.Pending ||
              order.status === OrderStatus.Processing) && (
              <Button
                variant="outline"
                className="flex-1 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                onClick={() => setShowCancelDialog(true)}
              >
                Hủy đơn
              </Button>
            )}

            {/* Đặt lại – GIỮ MÀU TRUNG TÍNH */}
            {order.status === OrderStatus.Cancelled && (
              <Button
                variant="outline"
                className="flex-1 border-gray-200 dark:border-gray-700 text-text-main dark:text-white"
                onClick={() => setShowReorderDialog(true)}
              >
                Đặt lại hàng
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ===== CANCEL DIALOG (NGUYÊN BẢN) ===== */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2c32] rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  Xác nhận hủy đơn
                </h3>
                <p className="text-sm text-text-sub dark:text-gray-400 mt-1">
                  Đơn hàng: <b>{order.order_code}</b>
                </p>
              </div>
            </div>

            <p className="text-text-main dark:text-gray-300 mb-6">
              Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
                className="flex-1"
              >
                Không
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isCancelling ? 'Đang hủy...' : 'Có, hủy đơn'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== REORDER DIALOG ===== */}
      {showReorderDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a2c32] rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <h3 className="text-xl font-bold text-text-main dark:text-white mb-4">
              Xác nhận đặt lại hàng
            </h3>
            <p className="text-text-main dark:text-gray-300 mb-6">
              Bạn có muốn đặt lại đơn hàng <b>{order.order_code}</b> không?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowReorderDialog(false)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmReorder}
                disabled={isReordering}
                className="flex-1"
              >
                {isReordering ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderCard
