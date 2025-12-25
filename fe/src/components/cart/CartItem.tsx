import { Link } from 'react-router-dom'
import { CartItemResponse } from '@/services/cart.service'
import { ROUTES } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'

interface CartItemProps {
  item: CartItemResponse
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  isUpdating?: boolean
}

const CartItem = ({ item, onUpdateQuantity, onRemove, isUpdating = false }: CartItemProps) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.buy_count + delta
    if (newQuantity >= 1) {
      onUpdateQuantity(item._id, newQuantity)
    }
  }

  const handleRemove = () => {
    onRemove(item._id)
  }

  const subtotal = (item.price || 0) * item.buy_count
  const productUrl = item.slug ? ROUTES.PRODUCT_DETAIL(item.slug) : ROUTES.PRODUCTS

  return (
    <tr className="group hover:bg-white dark:hover:bg-gray-800 transition-colors">
      {/* Product Info */}
      <td className="px-4 md:px-6 py-6">
        <div className="flex gap-4">
          <Link to={productUrl} className="flex-shrink-0">
            <div className="h-24 w-20 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {item.product_image ? (
                <img
                  src={item.product_image}
                  alt={item.product_name || 'Product'}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">
                    image
                  </span>
                </div>
              )}
            </div>
          </Link>
          <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
            <Link
              to={productUrl}
              className="text-base font-bold text-text-main dark:text-white hover:text-primary transition-colors line-clamp-2"
            >
              {item.product_name || 'Sản phẩm'}
            </Link>
            <div className="flex items-center gap-3 text-sm text-text-sub dark:text-gray-400 flex-wrap">
              {item.color && (
                <>
                  <span className="flex items-center gap-1">
                    <span
                      className="block size-3 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{
                        backgroundColor:
                          item.color.toLowerCase() === 'white'
                            ? '#FFFFFF'
                            : item.color.toLowerCase() === 'black'
                            ? '#000000'
                            : '#CCCCCC',
                      }}
                    ></span>
                    {item.color}
                  </span>
                  {item.size && <span className="w-px h-3 bg-gray-300 dark:bg-gray-600"></span>}
                </>
              )}
              {item.size && <span>Size {item.size}</span>}
            </div>
            <span className="lg:hidden mt-1 text-sm font-semibold text-primary">
              {formatPrice(item.price || 0)}
            </span>
          </div>
        </div>
      </td>

      {/* Price (Desktop only) */}
      <td className="px-4 md:px-6 py-6 text-center text-sm font-medium text-text-main dark:text-gray-300 hidden lg:table-cell">
        <div className="flex flex-col items-center gap-1">
          <span>{formatPrice(item.price || 0)}</span>
          {item.price_before_discount &&
            item.price_before_discount > (item.price || 0) && (
              <span className="text-xs text-text-sub dark:text-gray-400 line-through">
                {formatPrice(item.price_before_discount)}
              </span>
            )}
        </div>
      </td>

      {/* Quantity */}
      <td className="px-4 md:px-6 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.buy_count <= 1 || isUpdating}
              className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <input
              type="number"
              min="1"
              value={item.buy_count}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1
                if (val >= 1) {
                  onUpdateQuantity(item._id, val)
                }
              }}
              disabled={isUpdating}
              className="w-12 h-8 text-center text-sm border-0 border-x border-gray-300 dark:border-gray-600 bg-transparent text-text-main dark:text-white focus:outline-none focus:ring-0 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={isUpdating}
              className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>
      </td>

      {/* Subtotal */}
      <td className="px-4 md:px-6 py-6 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold text-text-main dark:text-white">
            {formatPrice(subtotal)}
          </span>
        </div>
      </td>

      {/* Remove Button */}
      <td className="px-2 md:px-4 py-6">
        <button
          type="button"
          onClick={handleRemove}
          disabled={isUpdating}
          className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove item"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </td>
    </tr>
  )
}

export default CartItem

