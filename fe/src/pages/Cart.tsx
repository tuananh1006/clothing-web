import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Skeleton from '@/components/common/Skeleton'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/utils/constants'
import type { CartItemResponse } from '@/services/cart.service'

const Cart = () => {
  const navigate = useNavigate()
  const { items, totalPrice, isLoading, updateQuantity, removeItem } = useCart()
  const { showError, showSuccess } = useToast()
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      setUpdatingItemId(itemId)
      await updateQuantity(itemId, quantity)
      showSuccess('Đã cập nhật số lượng sản phẩm')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể cập nhật số lượng. Vui lòng thử lại.')
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return
    }
    try {
      setRemovingItemId(itemId)
      await removeItem(itemId)
      showSuccess('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.')
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    navigate(ROUTES.CHECKOUT)
  }

  // Calculate shipping (free if subtotal >= 500,000)
  const FREE_SHIPPING_THRESHOLD = 500000
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 0 // Can be calculated from API later
  const total = totalPrice + shipping

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
            <div className="lg:w-80">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
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
              { label: 'Giỏ hàng', path: ROUTES.CART },
            ]}
          />

          {/* Page Layout */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mt-8">
            {/* Left Column: Cart Items */}
            <div className="flex-1 min-w-0">
              <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                  Giỏ hàng của bạn
                </h1>
                <p className="text-text-sub dark:text-gray-400">
                  Bạn đang có{' '}
                  <span className="font-bold text-text-main dark:text-white">
                    {items.length} sản phẩm
                  </span>{' '}
                  trong giỏ hàng
                </p>
              </header>

              {/* Cart Items */}
              {items.length > 0 ? (
                <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-text-sub dark:text-gray-400 font-bold">
                          <th className="px-4 md:px-6 py-4 w-[45%]">Sản phẩm</th>
                          <th className="px-4 md:px-6 py-4 w-[15%] text-center hidden lg:table-cell">
                            Đơn giá
                          </th>
                          <th className="px-4 md:px-6 py-4 w-[20%] text-center">Số lượng</th>
                          <th className="px-4 md:px-6 py-4 w-[15%] text-right">Tổng</th>
                          <th className="px-2 md:px-4 py-4 w-[5%]"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item: CartItemResponse) => (
                          <CartItem
                            key={item._id}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                            isUpdating={
                              updatingItemId === item._id || removingItemId === item._id
                            }
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
                    shopping_cart
                  </span>
                  <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    Giỏ hàng của bạn đang trống
                  </h2>
                  <p className="text-text-sub dark:text-gray-400 mb-6">
                    Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                  </p>
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#159cc9] transition-colors font-medium"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: Cart Summary */}
            {items.length > 0 && (
              <div className="lg:w-80">
                <CartSummary
                  subtotal={totalPrice}
                  shipping={shipping}
                  total={total}
                  onCheckout={handleCheckout}
                  isLoading={false}
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

export default Cart
