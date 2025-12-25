import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import Breadcrumb from '@/components/common/Breadcrumb'
import AddressForm from '@/components/checkout/AddressForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import * as checkoutService from '@/services/checkout.service'
import { ROUTES } from '@/utils/constants'
import type { ShippingAddress } from '@/types/order.types'

// Validation schema
const checkoutSchema = z.object({
  full_name: z.string().min(1, 'Vui lòng nhập họ và tên'),
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  province_id: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district_id: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  ward_id: z.string().min(1, 'Vui lòng chọn phường/xã'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ cụ thể'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalPrice, isLoading: cartLoading } = useCart()
  const { showError, showWarning } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [shippingFee, setShippingFee] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      province_id: '',
      district_id: '',
      ward_id: '',
      address: '',
    },
  })

  const formData = watch()

  // Fetch checkout init data
  useEffect(() => {
    const fetchInitData = async () => {
      try {
        const data = await checkoutService.getCheckoutInit()
        // Pre-fill form with user data
        if (data.user) {
          setValue('full_name', data.user.name || '')
          setValue('phone', data.user.phone || '')
          setValue('email', data.user.email || '')
        }
      } catch (error: any) {
        console.error('Failed to fetch checkout init:', error)
        showError(error.response?.data?.message || 'Không thể tải thông tin checkout. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    fetchInitData()
  }, [setValue, showError])

  // Validate shipping when address changes
  useEffect(() => {
    const validateShipping = async () => {
      if (
        !formData.province_id ||
        !formData.district_id ||
        !formData.ward_id ||
        !formData.address ||
        !formData.full_name ||
        !formData.phone ||
        !formData.email
      ) {
        return
      }

      try {
        const result = await checkoutService.validateShipping({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          province_id: formData.province_id,
          district_id: formData.district_id,
          ward_id: formData.ward_id,
          address: formData.address,
        })
        setShippingFee(result.shipping_fee)
      } catch (error) {
        console.error('Failed to validate shipping:', error)
      }
    }

    // Debounce validation
    const timeoutId = setTimeout(validateShipping, 500)
    return () => clearTimeout(timeoutId)
  }, [formData])


  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      showWarning('Giỏ hàng của bạn đang trống.')
      navigate(ROUTES.CART)
      return
    }

    setSubmitting(true)
    try {
      // Store shipping address in sessionStorage for payment page
      const shippingAddress: ShippingAddress = {
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        province_id: data.province_id,
        district_id: data.district_id,
        ward_id: data.ward_id,
        address: data.address,
      }
      sessionStorage.setItem('checkout_shipping_address', JSON.stringify(shippingAddress))
      sessionStorage.setItem('checkout_shipping_fee', shippingFee.toString())

      // Navigate to payment page
      navigate(ROUTES.CHECKOUT_PAYMENT)
    } catch (error: any) {
      console.error('Checkout failed:', error)
      showError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || cartLoading) {
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
              shopping_cart
            </span>
            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-text-sub dark:text-gray-400 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Button onClick={() => navigate(ROUTES.CART)}>Quay lại giỏ hàng</Button>
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
            {/* Left Column: Checkout Form */}
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main dark:text-white mb-2">
                  Thông tin giao hàng
                </h1>
                <p className="text-text-sub dark:text-gray-400">
                  {user ? (
                    <>Bạn đang đăng nhập với tài khoản {user.email}</>
                  ) : (
                    <>
                      Bạn đã có tài khoản?{' '}
                      <a
                        href={ROUTES.LOGIN}
                        className="font-medium text-primary hover:underline"
                      >
                        Đăng nhập
                      </a>{' '}
                      để thanh toán nhanh hơn.
                    </>
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Info */}
                <section>
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
                    Thông tin liên hệ
                  </h3>
                  <AddressForm
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    control={control}
                    disabled={submitting}
                  />
                </section>

                {/* Navigation Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.CART)}
                    className="flex items-center gap-2 text-sm font-bold text-text-sub dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Quay lại giỏ hàng
                  </button>
                  <Button type="submit" isLoading={submitting} className="w-full sm:w-auto">
                    Tiếp tục đến phương thức thanh toán
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

export default Checkout
