import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Coupon, { DiscountType, ApplicableTo } from '~/models/schemas/Coupon.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { createNotificationForAllUsers } from './notifications.services'
import { NotificationTypeEnum } from '~/models/schemas/Notification.schema'

/**
 * Tạo coupon mới
 */
export const createCoupon = async (couponData: {
  code: string
  name?: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  valid_from: Date | string
  valid_until: Date | string
  is_active?: boolean
  applicable_to?: ApplicableTo
  categories?: string[]
  products?: string[]
}) => {
  // Kiểm tra code đã tồn tại chưa
  const existingCoupon = await databaseServices.coupons.findOne({
    code: couponData.code.toUpperCase()
  })
  if (existingCoupon) {
    throw new Error('Mã giảm giá đã tồn tại')
  }

  const coupon = new Coupon({
    code: couponData.code,
    name: couponData.name,
    description: couponData.description,
    discount_type: couponData.discount_type,
    discount_value: couponData.discount_value,
    min_order_value: couponData.min_order_value,
    max_discount: couponData.max_discount,
    usage_limit: couponData.usage_limit,
    valid_from: typeof couponData.valid_from === 'string' ? new Date(couponData.valid_from) : couponData.valid_from,
    valid_until: typeof couponData.valid_until === 'string' ? new Date(couponData.valid_until) : couponData.valid_until,
    is_active: couponData.is_active,
    applicable_to: couponData.applicable_to,
    categories: couponData.categories ? couponData.categories.map((id) => new ObjectId(id)) : [],
    products: couponData.products ? couponData.products.map((id) => new ObjectId(id)) : [],
    created_at: new Date(),
    updated_at: new Date()
  })

  const result = await databaseServices.coupons.insertOne(coupon)
  const insertedCoupon = await databaseServices.coupons.findOne({ _id: result.insertedId })

  // Tạo notification cho tất cả users khi có coupon mới (chỉ khi coupon active)
  if (insertedCoupon && insertedCoupon.is_active) {
    try {
      const discountText =
        insertedCoupon.discount_type === DiscountType.Percentage
          ? `${insertedCoupon.discount_value}%`
          : `${insertedCoupon.discount_value.toLocaleString('vi-VN')}₫`

      await createNotificationForAllUsers({
        type: NotificationTypeEnum.NewCoupon,
        title: 'Mã giảm giá mới',
        message: `Mã giảm giá ${insertedCoupon.code} - Giảm ${discountText} đã được phát hành!`,
        data: {
          coupon_id: insertedCoupon._id?.toString(),
          coupon_code: insertedCoupon.code
        }
      })
    } catch (error) {
      console.error('Error creating notification for new coupon:', error)
      // Không throw error để không ảnh hưởng đến việc tạo coupon
    }
  }

  return insertedCoupon
}

/**
 * Lấy danh sách coupons với filter và pagination
 */
export const getCoupons = async (filters: {
  code?: string
  is_active?: boolean
  page?: number
  limit?: number
}) => {
  const { code, is_active, page = 1, limit = 100 } = filters
  const skip = (page - 1) * limit

  const query: any = {}
  if (code) {
    query.code = { $regex: code.toUpperCase(), $options: 'i' }
  }
  if (is_active !== undefined) {
    query.is_active = is_active
  }

  const [coupons, total] = await Promise.all([
    databaseServices.coupons
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    databaseServices.coupons.countDocuments(query)
  ])

  return {
    coupons,
    pagination: {
      page,
      limit,
      total,
      total_page: Math.ceil(total / limit)
    }
  }
}

/**
 * Lấy coupon theo ID
 */
export const getCouponById = async (couponId: string) => {
  const coupon = await databaseServices.coupons.findOne({ _id: new ObjectId(couponId) })
  if (!coupon) {
    throw new Error('Coupon not found')
  }
  return coupon
}

/**
 * Lấy coupon theo code
 */
export const getCouponByCode = async (code: string) => {
  const coupon = await databaseServices.coupons.findOne({ code: code.toUpperCase() })
  return coupon
}

/**
 * Validate coupon (kiểm tra có thể sử dụng không)
 */
export const validateCoupon = async (code: string, orderValue: number, userId?: string, productIds?: string[], categoryIds?: string[]) => {
  const coupon = await databaseServices.coupons.findOne({ code: code.toUpperCase() })
  
  if (!coupon) {
    return { valid: false, message: 'Mã giảm giá không tồn tại' }
  }

  if (!coupon.is_active) {
    return { valid: false, message: 'Mã giảm giá đã bị vô hiệu hóa' }
  }

  const now = new Date()
  if (now < coupon.valid_from) {
    return { valid: false, message: 'Mã giảm giá chưa có hiệu lực' }
  }

  if (now > coupon.valid_until) {
    return { valid: false, message: 'Mã giảm giá đã hết hạn' }
  }

  if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, message: 'Mã giảm giá đã hết lượt sử dụng' }
  }

  // Kiểm tra user đã sử dụng coupon này chưa
  if (userId) {
    const usedBy = coupon.used_by || []
    const hasUsed = usedBy.some((id) => id.toString() === userId)
    if (hasUsed) {
      return { valid: false, message: 'Bạn đã sử dụng mã giảm giá này rồi' }
    }
  }

  if (coupon.min_order_value > 0 && orderValue < coupon.min_order_value) {
    return { valid: false, message: `Đơn hàng tối thiểu ${coupon.min_order_value.toLocaleString('vi-VN')}đ` }
  }

  // Kiểm tra applicable_to
  if (coupon.applicable_to === ApplicableTo.SpecificCategories && categoryIds) {
    const couponCategoryIds = coupon.categories?.map((id) => id.toString()) || []
    const hasMatchingCategory = categoryIds.some((id) => couponCategoryIds.includes(id))
    if (!hasMatchingCategory) {
      return { valid: false, message: 'Mã giảm giá không áp dụng cho danh mục này' }
    }
  }

  if (coupon.applicable_to === ApplicableTo.SpecificProducts && productIds) {
    const couponProductIds = coupon.products?.map((id) => id.toString()) || []
    const hasMatchingProduct = productIds.some((id) => couponProductIds.includes(id))
    if (!hasMatchingProduct) {
      return { valid: false, message: 'Mã giảm giá không áp dụng cho sản phẩm này' }
    }
  }

  // Tính toán discount amount
  let discountAmount = 0
  if (coupon.discount_type === DiscountType.Percentage) {
    discountAmount = (orderValue * coupon.discount_value) / 100
    if (coupon.max_discount > 0 && discountAmount > coupon.max_discount) {
      discountAmount = coupon.max_discount
    }
  } else {
    discountAmount = coupon.discount_value
  }

  return {
    valid: true,
    coupon,
    discountAmount: Math.min(discountAmount, orderValue) // Không được giảm nhiều hơn giá trị đơn hàng
  }
}

/**
 * Cập nhật coupon
 */
export const updateCoupon = async (
  couponId: string,
  updateData: {
    code?: string
    name?: string
    description?: string
    discount_type?: DiscountType
    discount_value?: number
    min_order_value?: number
    max_discount?: number
    usage_limit?: number
    valid_from?: Date | string
    valid_until?: Date | string
    is_active?: boolean
    applicable_to?: ApplicableTo
    categories?: string[]
    products?: string[]
  }
) => {
  // Nếu cập nhật code, kiểm tra code đã tồn tại chưa
  if (updateData.code) {
    const existingCoupon = await databaseServices.coupons.findOne({
      code: updateData.code.toUpperCase(),
      _id: { $ne: new ObjectId(couponId) }
    })
    if (existingCoupon) {
      throw new Error('Mã giảm giá đã tồn tại')
    }
  }

  const updateFields: any = {
    updated_at: new Date()
  }

  if (updateData.code !== undefined) updateFields.code = updateData.code.toUpperCase()
  if (updateData.name !== undefined) updateFields.name = updateData.name
  if (updateData.description !== undefined) updateFields.description = updateData.description
  if (updateData.discount_type !== undefined) updateFields.discount_type = updateData.discount_type
  if (updateData.discount_value !== undefined) updateFields.discount_value = updateData.discount_value
  if (updateData.min_order_value !== undefined) updateFields.min_order_value = updateData.min_order_value
  if (updateData.max_discount !== undefined) updateFields.max_discount = updateData.max_discount
  if (updateData.usage_limit !== undefined) updateFields.usage_limit = updateData.usage_limit
  if (updateData.valid_from !== undefined) {
    updateFields.valid_from = typeof updateData.valid_from === 'string' ? new Date(updateData.valid_from) : updateData.valid_from
  }
  if (updateData.valid_until !== undefined) {
    updateFields.valid_until = typeof updateData.valid_until === 'string' ? new Date(updateData.valid_until) : updateData.valid_until
  }
  if (updateData.is_active !== undefined) updateFields.is_active = updateData.is_active
  if (updateData.applicable_to !== undefined) updateFields.applicable_to = updateData.applicable_to
  if (updateData.categories !== undefined) {
    updateFields.categories = updateData.categories.map((id) => new ObjectId(id))
  }
  if (updateData.products !== undefined) {
    updateFields.products = updateData.products.map((id) => new ObjectId(id))
  }

  const result = await databaseServices.coupons.findOneAndUpdate(
    { _id: new ObjectId(couponId) },
    { $set: updateFields },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw new Error('Coupon not found')
  }

  return result
}

/**
 * Tăng số lần sử dụng coupon và lưu userId vào used_by
 */
export const incrementCouponUsage = async (couponId: string, userId?: string) => {
  const updateFields: any = { $inc: { used_count: 1 } }
  
  // Nếu có userId, thêm vào used_by
  if (userId) {
    const userObjectId = new ObjectId(userId)
    updateFields.$addToSet = { used_by: userObjectId }
  }
  
  const result = await databaseServices.coupons.findOneAndUpdate(
    { _id: new ObjectId(couponId) },
    updateFields,
    { returnDocument: 'after' }
  )
  return result
}

/**
 * Xóa coupon
 */
export const deleteCoupon = async (couponId: string) => {
  const result = await databaseServices.coupons.findOneAndDelete({ _id: new ObjectId(couponId) })
  if (!result) {
    throw new Error('Coupon not found')
  }
  return result
}

