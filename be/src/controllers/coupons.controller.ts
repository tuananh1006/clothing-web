import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { getCouponByCode, validateCoupon, getCoupons } from '~/services/coupons.services'

/**
 * Controller: Validate coupon (public)
 */
export const validateCouponController = async (req: Request, res: Response) => {
  const { code, order_value, product_ids, category_ids } = req.body
  // Lấy userId từ token nếu có (optional - có thể validate không cần đăng nhập)
  const decoded = (req as any).decoded_authorization as { userId?: string } | undefined
  const userId = decoded?.userId

  if (!code || !order_value) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Code and order_value are required'
    })
  }

  try {
    const result = await validateCoupon(
      code,
      Number(order_value),
      userId, // Truyền userId vào validateCoupon
      product_ids,
      category_ids
    )

    if (!result.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: result.message,
        data: { valid: false }
      })
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Coupon is valid',
      data: {
        valid: true,
        coupon: result.coupon,
        discountAmount: result.discountAmount
      }
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

/**
 * Controller: Get coupon by code (public)
 */
export const getCouponByCodeController = async (req: Request, res: Response) => {
  const { code } = req.query

  if (!code) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Code is required'
    })
  }

  try {
    const coupon = await getCouponByCode(code as string)
    
    if (!coupon) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Coupon not found'
      })
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get coupon success',
      data: coupon
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

/**
 * Controller: Get available coupons (public)
 */
export const getAvailableCouponsController = async (req: Request, res: Response) => {
  const { order_value } = req.query
  const decoded = (req as any).decoded_authorization as { userId?: string } | undefined
  const userId = decoded?.userId

  try {
    const result = await getCoupons({
      is_active: true,
      page: 1,
      limit: 100
    })

    // Filter và validate từng coupon
    const now = new Date()
    const availableCoupons = []
    const orderValue = order_value ? Number(order_value) : 0

    for (const coupon of result.coupons) {
      // Kiểm tra thời gian hiệu lực
      const validFrom = new Date(coupon.valid_from)
      const validUntil = new Date(coupon.valid_until)
      if (now < validFrom || now > validUntil) {
        continue
      }

      // Kiểm tra usage limit
      if (coupon.usage_limit && coupon.usage_limit > 0 && coupon.used_count && coupon.used_count >= coupon.usage_limit) {
        continue
      }

      // Kiểm tra user đã sử dụng chưa
      if (userId && coupon.used_by) {
        const hasUsed = coupon.used_by.some((id: any) => id.toString() === userId)
        if (hasUsed) {
          continue
        }
      }

      // Kiểm tra min_order_value
      if (coupon.min_order_value && coupon.min_order_value > 0 && orderValue < coupon.min_order_value) {
        continue
      }

      // Tính discount amount
      let discountAmount = 0
      if (coupon.discount_type === 'percentage') {
        discountAmount = (orderValue * coupon.discount_value) / 100
        if (coupon.max_discount && coupon.max_discount > 0 && discountAmount > coupon.max_discount) {
          discountAmount = coupon.max_discount
        }
      } else {
        discountAmount = coupon.discount_value
      }

      availableCoupons.push({
        ...coupon,
        calculated_discount: Math.min(discountAmount, orderValue)
      })
    }

    // Sắp xếp theo discount amount giảm dần
    availableCoupons.sort((a, b) => b.calculated_discount - a.calculated_discount)

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get available coupons success',
      data: availableCoupons
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

