import { ObjectId } from 'mongodb'

export enum DiscountType {
  Percentage = 'percentage',
  FixedAmount = 'fixed_amount'
}

export enum ApplicableTo {
  All = 'all',
  SpecificCategories = 'specific_categories',
  SpecificProducts = 'specific_products'
}

interface CouponType {
  _id?: ObjectId
  code: string
  name?: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  used_count?: number
  used_by?: ObjectId[] // Danh sách user IDs đã sử dụng coupon này
  valid_from: Date
  valid_until: Date
  is_active?: boolean
  applicable_to?: ApplicableTo
  categories?: ObjectId[]
  products?: ObjectId[]
  created_at?: Date
  updated_at?: Date
}

export default class Coupon {
  _id?: ObjectId
  code: string
  name: string
  description: string
  discount_type: DiscountType
  discount_value: number
  min_order_value: number
  max_discount: number
  usage_limit: number
  used_count: number
  used_by: ObjectId[] // Danh sách user IDs đã sử dụng coupon này
  valid_from: Date
  valid_until: Date
  is_active: boolean
  applicable_to: ApplicableTo
  categories: ObjectId[]
  products: ObjectId[]
  created_at: Date
  updated_at: Date

  constructor(coupon: CouponType) {
    this._id = coupon._id
    this.code = coupon.code.toUpperCase()
    this.name = coupon.name || ''
    this.description = coupon.description || ''
    this.discount_type = coupon.discount_type
    this.discount_value = coupon.discount_value
    this.min_order_value = coupon.min_order_value || 0
    this.max_discount = coupon.max_discount || 0
    this.usage_limit = coupon.usage_limit || 0
    this.used_count = coupon.used_count || 0
    this.used_by = coupon.used_by || []
    this.valid_from = coupon.valid_from
    this.valid_until = coupon.valid_until
    this.is_active = coupon.is_active !== undefined ? coupon.is_active : true
    this.applicable_to = coupon.applicable_to || ApplicableTo.All
    this.categories = coupon.categories || []
    this.products = coupon.products || []
    this.created_at = coupon.created_at || new Date()
    this.updated_at = coupon.updated_at || new Date()
  }
}

