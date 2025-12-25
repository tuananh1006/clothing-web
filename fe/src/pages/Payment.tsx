import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import OrderSummary from '@/components/checkout/OrderSummary'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'
import * as checkoutService from '@/services/checkout.service'
import { ROUTES } from '@/utils/constants'
import type { ShippingAddress, PlaceOrderRequest } from '@/types/order.types'

// Validation schema
const paymentSchema = z.object({
  payment_method: z.string().min(1, 'Vui lòng chọn phương thức thanh toán'),
  note: z.string().optional(),
  billing_address_same_as_shipping: z.boolean().default(true),
})

type PaymentFormData = z.infer<typeof paymentSchema>

const Payment = () => {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { showError, showWarning, showSuccess } = useToast()
  const [paymentInfo, setPaymentInfo] = useState<checkoutService.PaymentInfoResponse | null>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [shippingFee, setShippingFee] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: '',
      note: '',
      billing_address_same_as_shipping: true,
    },
  })

  // Load shipping address from sessionStorage and payment info
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get shipping address from sessionStorage
        const savedShippingAddress = sessionStorage.getItem('checkout_shipping_address')
        const savedShippingFee = sessionStorage.getItem('checkout_shipping_fee')

        if (!savedShippingAddress) {
          // Redirect to checkout if no shipping address
          navigate(ROUTES.CHECKOUT)
          return
        }

        setShippingAddress(JSON.parse(savedShippingAddress))
        setShippingFee(parseInt(savedShippingFee || '0', 10))

        // Fetch payment info
        const paymentData = await checkoutService.getPaymentInfo()
        setPaymentInfo(paymentData)
        // Set default payment method
        if (paymentData.payment_methods.length > 0) {
          // Prefer COD if available, otherwise first method
          const codMethod = paymentData.payment_methods.find((m) => m.id === 'cod')
          if (codMethod && codMethod.is_enabled) {
            // Will be set via register default
          }
        }
      } catch (error: any) {
        console.error('Failed to load payment data:', error)
        showError(error.response?.data?.message || 'Không thể tải thông tin thanh toán. Vui lòng thử lại.')
        navigate(ROUTES.CHECKOUT)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [navigate])

  const onSubmit = async (data: PaymentFormData) => {
    if (!shippingAddress || items.length === 0) {
      showWarning('Thông tin không hợp lệ. Vui lòng thử lại.')
      navigate(ROUTES.CHECKOUT)
      return
    }

    setSubmitting(true)
    try {
      // Prepare order data
      // Backend expects shipping_address as a string, so we'll construct it from the address object
      // For now, we'll send the structured object and let the service handle the transformation
      const orderData: PlaceOrderRequest = {
        payment_method: data.payment_method,
        note: data.note,
        billing_address_same_as_shipping: data.billing_address_same_as_shipping,
        shipping_address: shippingAddress,
        receiver_name: shippingAddress.full_name,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
      }

      // Place order
      const result = await checkoutService.placeOrder(orderData)

      // Clear cart
      clearCart()

      // Clear sessionStorage
      sessionStorage.removeItem('checkout_shipping_address')
      sessionStorage.removeItem('checkout_shipping_fee')

      // Show success message
      showSuccess('Đặt hàng thành công!')
      // Redirect to order success page
      navigate(ROUTES.ORDER_SUCCESS(result.order_id || result.order_code))
    } catch (error: any) {
      console.error('Place order failed:', error)
      showError(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
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

  if (!shippingAddress || !paymentInfo || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
              Không tìm thấy thông tin đơn hàng
            </h2>
            <Button onClick={() => navigate(ROUTES.CHECKOUT)}>Quay lại checkout</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const total = totalPrice + shippingFee

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Giỏ hàng', path: ROUTES.CART },
              { label: 'Giao hàng', path: ROUTES.CHECKOUT },
              { label: 'Thanh toán', path: ROUTES.CHECKOUT_PAYMENT },
              { label: 'Hoàn tất' },
            ]}
          />

          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mt-8">
            {/* Left Column: Payment Form */}
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                  Phương thức thanh toán
                </h1>
                <p className="text-text-sub dark:text-gray-400">
                  Chọn phương thức thanh toán phù hợp với bạn
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Methods */}
                {paymentInfo.payment_methods
                  .filter((method) => method.is_enabled)
                  .map((method) => (
                    <div
                      key={method.id}
                      className={`relative rounded-xl border-2 p-6 shadow-sm transition-all ${
                        watch('payment_method') === method.id
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2c32] hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex items-center h-6">
                          <input
                            type="radio"
                            id={`payment-${method.id}`}
                            value={method.id}
                            {...register('payment_method')}
                            className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`payment-${method.id}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              {method.id === 'cod' && (
                                <span className="material-symbols-outlined text-text-sub dark:text-gray-400">
                                  payments
                                </span>
                              )}
                              {method.id === 'ewallet' && (
                                <span className="material-symbols-outlined text-text-sub dark:text-gray-400">
                                  qr_code_scanner
                                </span>
                              )}
                              {method.id === 'bank_transfer' && (
                                <span className="material-symbols-outlined text-text-sub dark:text-gray-400">
                                  account_balance
                                </span>
                              )}
                              <span className="block text-base font-semibold text-text-main dark:text-white">
                                {method.name}
                              </span>
                            </div>
                            {method.icons && (
                              <div className="flex gap-2">
                                {method.icons.map((icon) => (
                                  <span
                                    key={icon}
                                    className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
                                  >
                                    {icon}
                                  </span>
                                ))}
                              </div>
                            )}
                          </label>
                          {method.description && (
                            <p className="text-sm text-text-sub dark:text-gray-400 mt-1 ml-9">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {errors.payment_method && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.payment_method.message}
                  </p>
                )}

                {/* Note Field */}
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                    Ghi chú (Tùy chọn)
                  </label>
                  <textarea
                    {...register('note')}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111d21] px-4 py-3 text-base text-text-main dark:text-white placeholder:text-text-sub dark:placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  />
                </div>

                {/* Billing Address Checkbox */}
                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="billing-address"
                    {...register('billing_address_same_as_shipping')}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5"
                  />
                  <label
                    htmlFor="billing-address"
                    className="text-sm font-medium text-text-main dark:text-white cursor-pointer"
                  >
                    Địa chỉ thanh toán giống địa chỉ giao hàng
                  </label>
                </div>

                {/* Navigation Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.CHECKOUT)}
                    className="w-full sm:w-auto text-text-sub dark:text-gray-400 hover:text-primary font-medium text-sm flex items-center justify-center gap-2 px-4 py-3 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Quay lại vận chuyển
                  </button>
                  <Button type="submit" isLoading={submitting} className="w-full sm:w-auto">
                    Thanh toán ngay
                    <span className="material-symbols-outlined text-lg ml-2">arrow_forward</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:w-80">
              <div className="sticky top-24">
                <OrderSummary
                  items={items}
                  subtotal={totalPrice}
                  shippingFee={shippingFee}
                  total={total}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Payment
