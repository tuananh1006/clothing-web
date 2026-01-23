import { useState, useEffect } from 'react'
import { getAvailableCoupons, type Coupon } from '@/services/coupons.service'
import { useToast } from '@/contexts/ToastContext'

interface CouponSelectorProps {
  orderValue: number
  selectedCoupon?: Coupon | null
  onSelectCoupon: (coupon: Coupon | null) => void
  className?: string
}

const CouponSelector = ({ orderValue, selectedCoupon, onSelectCoupon, className = '' }: CouponSelectorProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { showError } = useToast()

  useEffect(() => {
    const loadCoupons = async () => {
      if (orderValue <= 0) return

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
  }, [orderValue, showError])

  const handleSelectCoupon = (coupon: Coupon) => {
    if (selectedCoupon?._id === coupon._id) {
      // Deselect nếu đã chọn
      onSelectCoupon(null)
    } else {
      onSelectCoupon(coupon)
    }
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
    <div className={`bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-text-main dark:text-white hover:text-primary transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">local_offer</span>
            Mã giảm giá {coupons.length > 0 && `(${coupons.length})`}
          </span>
          <span className="material-symbols-outlined text-lg transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            expand_more
          </span>
        </button>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )}

      {!isLoading && isExpanded && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {coupons.length === 0 ? (
            <div className="text-center py-4">
              <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600 mb-2">local_offer</span>
              <p className="text-sm text-text-sub dark:text-gray-400">Hiện tại không có mã giảm giá nào</p>
            </div>
          ) : (
            coupons.map((coupon) => {
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
          })
          )}
        </div>
      )}

      {selectedCoupon && (
        <div className="mt-3 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-main dark:text-white">
                Đã chọn: <span className="text-primary font-bold">{selectedCoupon.code}</span>
              </p>
              {selectedCoupon.calculated_discount && selectedCoupon.calculated_discount > 0 && (
                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                  Bạn sẽ được giảm: <span className="font-bold text-primary">{formatDiscountAmount(selectedCoupon)}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelectCoupon(null)}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CouponSelector

