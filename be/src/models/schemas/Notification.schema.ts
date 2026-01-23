import { ObjectId } from 'mongodb'

export enum NotificationTypeEnum {
  OrderStatusUpdate = 'order_status_update',
  OrderPlaced = 'order_placed',
  OrderCancelled = 'order_cancelled',
  NewCoupon = 'new_coupon',
  OrderShipped = 'order_shipped',
  OrderDelivered = 'order_delivered',
  ReviewRejected = 'review_rejected',
  AccountBanned = 'account_banned',
  General = 'general'
}

interface NotificationTypeInterface {
  _id?: ObjectId
  user_id: ObjectId
  type: NotificationTypeEnum
  title: string
  message: string
  data?: {
    order_id?: string
    order_code?: string
    coupon_id?: string
    coupon_code?: string
    [key: string]: any
  }
  read?: boolean
  read_at?: Date
  created_at?: Date
  updated_at?: Date
}

export default class Notification {
  _id?: ObjectId
  user_id: ObjectId
  type: NotificationTypeEnum
  title: string
  message: string
  data: {
    order_id?: string
    order_code?: string
    coupon_id?: string
    coupon_code?: string
    [key: string]: any
  }
  read: boolean
  read_at?: Date
  created_at: Date
  updated_at: Date

  constructor(notification: NotificationTypeInterface) {
    this._id = notification._id
    this.user_id = notification.user_id
    this.type = notification.type
    this.title = notification.title
    this.message = notification.message
    this.data = notification.data || {}
    this.read = notification.read || false
    this.read_at = notification.read_at
    this.created_at = notification.created_at || new Date()
    this.updated_at = notification.updated_at || new Date()
  }
}
