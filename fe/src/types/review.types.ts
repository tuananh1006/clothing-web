export interface Review {
  _id: string
  user_id: string
  product_id: string
  order_id?: string
  rating: number
  comment: string
  images: string[]
  helpful_count: number
  helpful_users?: string[] // User IDs who marked as helpful
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  user?: {
    _id: string
    name: string
    email: string
    avatar_url?: string
  }
}

export interface ReviewRatingDistribution {
  5: number
  4: number
  3: number
  2: number
  1: number
}

export interface ProductReviewsResponse {
  reviews: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
  rating_distribution: ReviewRatingDistribution
}

export interface CreateReviewData {
  product_id: string
  order_id?: string
  rating: number
  comment?: string
  images?: string[]
}

export interface UpdateReviewData {
  rating?: number
  comment?: string
  images?: string[]
}

