import { ObjectId } from 'mongodb'

export enum ReviewStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}

interface ReviewType {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  order_id?: ObjectId // Link to order để verify user đã mua
  rating: number // 1-5
  comment?: string
  images?: string[] // URLs của ảnh review
  helpful_count?: number
  helpful_users?: ObjectId[] // Track users who marked as helpful
  status?: ReviewStatus
  created_at?: Date
  updated_at?: Date
}

export default class Review {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  order_id?: ObjectId
  rating: number
  comment: string
  images: string[]
  helpful_count: number
  helpful_users: ObjectId[] // Track users who marked as helpful
  status: ReviewStatus
  created_at: Date
  updated_at: Date

  constructor(review: ReviewType) {
    this._id = review._id
    this.user_id = review.user_id
    this.product_id = review.product_id
    this.order_id = review.order_id
    this.rating = review.rating
    this.comment = review.comment || ''
    this.images = review.images || []
    this.helpful_count = review.helpful_count || 0
    this.helpful_users = review.helpful_users || []
    this.status = review.status || ReviewStatus.Pending
    this.created_at = review.created_at || new Date()
    this.updated_at = review.updated_at || new Date()
  }
}

