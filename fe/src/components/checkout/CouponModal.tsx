import { useState, useEffect } from 'react'
import { getAvailableCoupons, type Coupon } from '@/services/coupons.service'
import { useToast } from '@/contexts/ToastContext'
import Modal from '@/components/common/Modal'

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  orderValue: number
  selectedCoupon?: Coupon | null
  onSelectCoupon: (coupon: Coupon | null) => void
}

const CouponModal = ({ isOpen, onClose, orderValue, selectedCoupon, onSelectCoupon }: CouponModalProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { showError } = useToast()

  useEffect(() => {
    const loadCoupons = async () => {
      if (!isOpen || orderValue <= 0) return

      setIsLoading(true)
      try {
        const availableCoupons = await getAvailableCoupons(orderValue)
        setCoupons(availableCoupons)
      } catch (error: any) {
        console.error('Failed to load coupons:', error)
        showError('Không thể tải danh sách mã giảm giá')
      } finally {
        setIsLoading(false)
      }
    }

    loadCoupons()
  }, [isOpen, orderValue, showError])

  const handleSelectCoupon = (coupon: Coupon) => {
    if (selectedCoupon?._id === coupon._id) {
      // Deselect nếu đã chọn
      onSelectCoupon(null)
    } else {
      onSelectCoupon(coupon)
    }
    onClose()
  }

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `Giảm ${coupon.discount_value}%`
    } else {
      return `Giảm ${coupon.discount_value.toLocaleString('vi-VN')}₫`
    }
  }

  const formatDiscountAmount = (coupon: Coupon) => {
    const discount = coupon.calculated_discount || 0
    return discount > 0 ? `-${discount.toLocaleString('vi-VN')}₫` : ''
  }

  // Tìm coupon có discount cao nhất (phù hợp nhất)
  const bestCoupon = coupons.length > 0 ? coupons[0] : null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chọn mã giảm giá" size="lg">
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">local_offer</span>
          <p className="text-lg font-medium text-text-main dark:text-white mb-2">Không có mã giảm giá nào</p>
          <p className="text-sm text-text-sub dark:text-gray-400">Hiện tại không có mã giảm giá nào phù hợp với đơn hàng của bạn</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {coupons.map((coupon) => {
            const isSelected = selectedCoupon?._id === coupon._id
            const isBest = bestCoupon?._id === coupon._id

            return (
              <div
                key={coupon._id}
                className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50'
                }`}
                onClick={() => handleSelectCoupon(coupon)}
              >
                {isBest && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                      <span className="material-symbols-outlined text-sm">star</span>
                      Phù hợp nhất
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-primary">{coupon.code}</span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      )}
                    </div>
                    {coupon.name && (
                      <p className="text-sm font-medium text-text-main dark:text-white mb-1">{coupon.name}</p>
                    )}
                    {coupon.description && (
                      <p className="text-xs text-text-sub dark:text-gray-400 mb-2 line-clamp-2">{coupon.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-text-main dark:text-white">{formatDiscount(coupon)}</span>
                      {coupon.calculated_discount && coupon.calculated_discount > 0 && (
                        <span className="text-sm font-bold text-primary">{formatDiscountAmount(coupon)}</span>
                      )}
                    </div>
                    {coupon.min_order_value && coupon.min_order_value > 0 && (
                      <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                        Đơn tối thiểu: {coupon.min_order_value.toLocaleString('vi-VN')}₫
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

export default CouponModal

