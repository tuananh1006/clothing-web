export interface AddToCartReqBody {
  product_id: string
  buy_count: number
  color?: string
  size?: string
}

export interface UpdateCartReqBody {
  buy_count: number
}
