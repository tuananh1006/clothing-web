export interface CreateReviewReqBody {
  product_id: string
  order_id?: string
  rating: number
  comment?: string
  images?: string[]
}

export interface UpdateReviewReqBody {
  rating?: number
  comment?: string
  images?: string[]
}

export interface MarkHelpfulReqBody {
  helpful: boolean
}

