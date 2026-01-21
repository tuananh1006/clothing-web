import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Product from '~/models/schemas/Product.schema'
import Wishlist from '~/models/schemas/Wishlist.schema'

class WishlistService {
  async getUserWishlist(user_id: string) {
    const userObjectId = new ObjectId(user_id)

    const pipeline = [
      { $match: { user_id: userObjectId } },
      {
        $lookup: {
          from: databaseServices.products.collectionName,
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          product: 1,
          created_at: 1
        }
      },
      { $sort: { created_at: -1 } }
    ]

    const items = await databaseServices.wishlists.aggregate<{
      product: Product
      created_at: Date
    }>(pipeline).toArray()

    return items
  }

  async addToWishlist(user_id: string, product_id: string) {
    const userObjectId = new ObjectId(user_id)
    const productObjectId = new ObjectId(product_id)

    const product = await databaseServices.products.findOne({ _id: productObjectId })
    if (!product) return

    const existing = await databaseServices.wishlists.findOne({
      user_id: userObjectId,
      product_id: productObjectId
    })

    if (existing) return

    const wishlistItem = new Wishlist({
      user_id: userObjectId,
      product_id: productObjectId
    })

    await databaseServices.wishlists.insertOne(wishlistItem)
  }

  async removeFromWishlist(user_id: string, product_id: string) {
    const userObjectId = new ObjectId(user_id)
    const productObjectId = new ObjectId(product_id)

    await databaseServices.wishlists.deleteOne({
      user_id: userObjectId,
      product_id: productObjectId
    })
  }
}

export default new WishlistService()


