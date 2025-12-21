import { ObjectId } from 'mongodb'

export interface CartItem {
  _id?: ObjectId
  product_id: ObjectId
  buy_count: number
  color?: string
  size?: string
}

export default class Cart {
  _id?: ObjectId
  user_id: ObjectId
  items: CartItem[]
  created_at?: Date
  updated_at?: Date

  constructor(cart: { user_id: ObjectId; items?: CartItem[]; created_at?: Date; updated_at?: Date; _id?: ObjectId }) {
    this._id = cart._id
    this.user_id = cart.user_id
    this.items = cart.items || []
    // Ensure items have _id
    this.items = this.items.map((item) => ({
      ...item,
      _id: item._id || new ObjectId()
    }))
    this.created_at = cart.created_at || new Date()
    this.updated_at = cart.updated_at || new Date()
  }
}
