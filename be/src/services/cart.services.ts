import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { AddToCartReqBody } from '~/models/requests/cart.requests'
import Cart, { CartItem } from '~/models/schemas/Cart.schema'

class CartService {
  async addToCart(user_id: string, body: AddToCartReqBody) {
    const product_id = new ObjectId(body.product_id)
    const cart = await databaseServices.carts.findOne({ user_id: new ObjectId(user_id) })

    const newItem: CartItem = {
      _id: new ObjectId(),
      product_id,
      buy_count: body.buy_count,
      color: body.color,
      size: body.size
    }

    if (!cart) {
      await databaseServices.carts.insertOne(
        new Cart({
          user_id: new ObjectId(user_id),
          items: [newItem]
        })
      )
    } else {
      // Check if item exists
      const existItemIndex = cart.items.findIndex(
        (item) => item.product_id.equals(product_id) && item.color === body.color && item.size === body.size
      )

      if (existItemIndex !== -1) {
        // Update quantity
        cart.items[existItemIndex].buy_count += body.buy_count
        await databaseServices.carts.updateOne(
          { _id: cart._id },
          {
            $set: { items: cart.items, updated_at: new Date() }
          }
        )
      } else {
        // Push new item
        await databaseServices.carts.updateOne(
          { _id: cart._id },
          {
            $push: { items: newItem },
            $set: { updated_at: new Date() }
          }
        )
      }
    }
    return { message: 'Add to cart successfully' }
  }

  async getCart(user_id: string) {
    const result = await databaseServices.carts
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } },
        { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product_id',
            foreignField: '_id',
            as: 'product_info'
          }
        },
        { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            user_id: { $first: '$user_id' },
            items: {
              $push: {
                _id: '$items._id',
                product_id: '$items.product_id',
                buy_count: '$items.buy_count',
                color: '$items.color',
                size: '$items.size',
                product_name: '$product_info.name',
                product_image: { $arrayElemAt: ['$product_info.images', 0] },
                price: '$product_info.price',
                price_before_discount: '$product_info.price_before_discount',
                slug: '$product_info.slug'
              }
            }
          }
        }
      ])
      .toArray()

    if (result.length === 0) return { items: [] }

    // If items is [ {} ] (due to unwind on empty array), return empty items
    if (result[0].items.length === 1 && !result[0].items[0]._id) {
      return { ...result[0], items: [] }
    }

    return result[0]
  }

  async updateCartItem(user_id: string, item_id: string, buy_count: number) {
    await databaseServices.carts.updateOne(
      { user_id: new ObjectId(user_id), 'items._id': new ObjectId(item_id) },
      {
        $set: {
          'items.$.buy_count': buy_count,
          updated_at: new Date()
        }
      }
    )
    return { message: 'Update cart item successfully' }
  }

  async deleteCartItem(user_id: string, item_id: string) {
    await databaseServices.carts.updateOne(
      { user_id: new ObjectId(user_id) },
      {
        $pull: { items: { _id: new ObjectId(item_id) } },
        $set: { updated_at: new Date() }
      }
    )
    return { message: 'Delete cart item successfully' }
  }
}

export default new CartService()
