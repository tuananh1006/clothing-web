import { ObjectId } from 'mongodb'

class Wishlist {
  _id?: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  created_at: Date

  constructor({ user_id, product_id }: { user_id: ObjectId; product_id: ObjectId }) {
    this.user_id = user_id
    this.product_id = product_id
    this.created_at = new Date()
  }
}

export default Wishlist


