import { formatPrice } from '@/utils/formatters'
import type { CartItemResponse } from '@/services/cart.service'

interface OrderSummaryProps {
  items: CartItemResponse[]
  subtotal: number
  shippingFee?: number
  discountAmount?: number
  total: number
  showItems?: boolean
}

const OrderSummary = ({
  items,
  subtotal,
  shippingFee = 0,
  discountAmount = 0,
  total,
  showItems = true,
}: OrderSummaryProps) => {
  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
        Đơn hàng ({items.length} sản phẩm)
      </h2>

      {/* Items List */}
      {showItems && (
        <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_name || 'Product'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400">image</span>
                  </div>
                )}
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 dark:bg-gray-600 text-xs font-bold text-white">
                  {item.buy_count}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center min-w-0">
                <h3 className="text-base font-medium text-text-main dark:text-white line-clamp-2">
                  {item.product_name || 'Sản phẩm'}
                </h3>
                <p className="text-sm text-text-sub dark:text-gray-400">
                  {[item.size && `Size ${item.size}`, item.color].filter(Boolean).join(' / ')}
                </p>
              </div>
              <div className="flex items-center">
                <p className="text-base font-medium text-text-main dark:text-white">
                  {formatPrice((item.price || 0) * item.buy_count)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex justify-between text-base">
          <span className="text-text-sub dark:text-gray-400">Tạm tính</span>
          <span className="font-medium text-text-main dark:text-white">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-base">
          <span className="text-text-sub dark:text-gray-400">Phí vận chuyển</span>
          <span className="font-medium text-text-main dark:text-white">
            {shippingFee > 0 ? formatPrice(shippingFee) : '—'}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-base text-green-600 dark:text-green-400">
            <span>Giảm giá</span>
            <span className="font-medium">-{formatPrice(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
        <span className="text-lg font-bold text-text-main dark:text-white">Tổng cộng</span>
        <div className="flex items-end gap-2">
          <span className="text-sm font-medium text-text-sub dark:text-gray-400">VND</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary

