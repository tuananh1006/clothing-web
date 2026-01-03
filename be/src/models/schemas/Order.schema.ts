import { ObjectId } from 'mongodb'

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipping = 'shipping',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export interface OrderItem {
  product_id: ObjectId
  name: string
  thumbnail_url: string
  variant_text: string
  price: number
  quantity: number
  total: number
}

export interface ShippingInfo {
  receiver_name: string
  phone: string
  email: string
  address: string
  province_id?: string
  district_id?: string
  ward_id?: string
  payment_method: string
  estimated_delivery: string
}

export interface CostSummary {
  subtotal: number
  shipping_fee: number
  discount_amount: number
  total: number
}

export default class Order {
  _id?: ObjectId
  user_id: ObjectId
  order_code: string
  status: OrderStatus
  shipping_info: ShippingInfo
  items: OrderItem[]
  cost_summary: CostSummary
  note?: string
  created_at?: Date
  updated_at?: Date

  constructor(order: {
    user_id: ObjectId
    order_code: string
    status?: OrderStatus
    shipping_info: ShippingInfo
    items: OrderItem[]
    cost_summary: CostSummary
    note?: string
    created_at?: Date
    updated_at?: Date
    _id?: ObjectId
  }) {
    this._id = order._id
    this.user_id = order.user_id
    this.order_code = order.order_code
    this.status = order.status || OrderStatus.Pending
    this.shipping_info = order.shipping_info
    this.items = order.items
    this.cost_summary = order.cost_summary
    this.note = order.note
    this.created_at = order.created_at || new Date()
    this.updated_at = order.updated_at || new Date()
  }
}
