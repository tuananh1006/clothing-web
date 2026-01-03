import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Review, { ReviewStatus } from '~/models/schemas/Review.schema'
import { CreateReviewReqBody, UpdateReviewReqBody } from '~/models/requests/review.requests'
import productsServices from './products.services'
import { OrderStatus } from '~/models/schemas/Order.schema'

class ReviewsService {
  /**
   * Kiểm tra user đã mua sản phẩm này chưa
   */
  async verifyUserPurchasedProduct(user_id: string, product_id: string, order_id?: string): Promise<boolean> {
    const userId = new ObjectId(user_id)
    const productId = new ObjectId(product_id)

    // Nếu có order_id, check order đó có chứa product này không
    if (order_id) {
      const order = await databaseServices.orders.findOne({
        _id: new ObjectId(order_id),
        user_id: userId,
        status: OrderStatus.Completed
      })

      if (order) {
        const hasProduct = order.items.some((item) => item.product_id.toString() === product_id)
        return hasProduct
      }
    }

    // Nếu không có order_id, check tất cả orders của user
    const orders = await databaseServices.orders
      .find({
        user_id: userId,
        status: OrderStatus.Completed,
        'items.product_id': productId
      })
      .toArray()

    return orders.length > 0
  }

  /**
   * Kiểm tra user đã review sản phẩm này chưa
   */
  async hasUserReviewed(user_id: string, product_id: string): Promise<boolean> {
    const existingReview = await databaseServices.reviews.findOne({
      user_id: new ObjectId(user_id),
      product_id: new ObjectId(product_id),
      status: { $ne: ReviewStatus.Rejected }
    })

    return !!existingReview
  }

  /**
   * Tạo review mới
   * Cho phép tất cả users đánh giá, không cần verify đã mua
   */
  async createReview(user_id: string, body: CreateReviewReqBody) {
    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // Check user đã review chưa (vẫn giới hạn 1 review per user per product)
    const hasReviewed = await this.hasUserReviewed(user_id, body.product_id)
    if (hasReviewed) {
      throw new Error('You have already reviewed this product')
    }

    // Check product exists
    const product = await databaseServices.products.findOne({ _id: new ObjectId(body.product_id) })
    if (!product) {
      throw new Error('Product not found')
    }

    // Nếu có order_id, verify nó thuộc về user (optional verification)
    let verifiedOrderId: ObjectId | undefined = undefined
    if (body.order_id) {
      const order = await databaseServices.orders.findOne({
        _id: new ObjectId(body.order_id),
        user_id: new ObjectId(user_id)
      })
      if (order) {
        verifiedOrderId = new ObjectId(body.order_id)
      }
      // Nếu order_id không hợp lệ, vẫn cho phép tạo review nhưng không link order
    }

    const review = new Review({
      user_id: new ObjectId(user_id),
      product_id: new ObjectId(body.product_id),
      order_id: verifiedOrderId,
      rating: body.rating,
      comment: body.comment,
      images: body.images || [],
      status: ReviewStatus.Approved // Auto-approve, có thể thay đổi thành Pending nếu cần moderation
    })

    const result = await databaseServices.reviews.insertOne(review)

    // Update product rating
    await this.updateProductRating(body.product_id)

    return result.insertedId
  }

  /**
   * Lấy reviews của một sản phẩm
   */
  async getProductReviews(product_id: string, page: number = 1, limit: number = 10, sort_by: 'newest' | 'helpful' | 'rating' = 'newest') {
    // Validate product_id
    if (!product_id) {
      throw new Error('Product ID is required')
    }

    let productId: ObjectId
    try {
      productId = new ObjectId(product_id)
    } catch (error) {
      throw new Error('Invalid product ID format')
    }
    const skip = (page - 1) * limit

    // Build sort
    let sort: any = {}
    switch (sort_by) {
      case 'newest':
        sort = { created_at: -1 }
        break
      case 'helpful':
        sort = { helpful_count: -1, created_at: -1 }
        break
      case 'rating':
        sort = { rating: -1, created_at: -1 }
        break
    }

    const [reviews, total] = await Promise.all([
      databaseServices.reviews
        .find({
          product_id: productId,
          status: ReviewStatus.Approved
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.reviews.countDocuments({
        product_id: productId,
        status: ReviewStatus.Approved
      })
    ])

    // Populate user info
    const userIds = Array.from(new Set(reviews.map((r) => r.user_id.toString()))).map((id) => new ObjectId(id))
    const users = userIds.length
      ? await databaseServices.users
          .find({ _id: { $in: userIds } })
          .toArray()
      : []

    const userMap = new Map(users.map((u) => [u._id?.toString(), u]))

    const reviewsWithUsers = reviews.map((review) => {
      const user = userMap.get(review.user_id.toString())
      return {
        ...review,
        user: user
          ? {
              _id: user._id,
              name: user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.email,
              email: user.email,
              avatar_url: user.avatar || user.avatar_url
            }
          : null,
        helpful_users: review.helpful_users?.map((id) => id.toString()) || []
      }
    })

    // Calculate rating distribution
    const allReviews = await databaseServices.reviews
      .find({
        product_id: productId,
        status: ReviewStatus.Approved
      })
      .toArray()

    const ratingDistribution = {
      5: allReviews.filter((r) => r.rating === 5).length,
      4: allReviews.filter((r) => r.rating === 4).length,
      3: allReviews.filter((r) => r.rating === 3).length,
      2: allReviews.filter((r) => r.rating === 2).length,
      1: allReviews.filter((r) => r.rating === 1).length
    }

    return {
      reviews: reviewsWithUsers,
      pagination: {
        page,
        limit,
        total,
        total_page: Math.ceil(total / limit)
      },
      rating_distribution: ratingDistribution
    }
  }

  /**
   * Update review
   */
  async updateReview(review_id: string, user_id: string, body: UpdateReviewReqBody) {
    const reviewId = new ObjectId(review_id)
    const userId = new ObjectId(user_id)

    const review = await databaseServices.reviews.findOne({
      _id: reviewId,
      user_id: userId
    })

    if (!review) {
      throw new Error('Review not found or you do not have permission to update it')
    }

    const updateData: any = {
      updated_at: new Date()
    }

    if (body.rating !== undefined) {
      if (body.rating < 1 || body.rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }
      updateData.rating = body.rating
    }

    if (body.comment !== undefined) {
      updateData.comment = body.comment
    }

    if (body.images !== undefined) {
      updateData.images = body.images
    }

    await databaseServices.reviews.updateOne({ _id: reviewId }, { $set: updateData })

    // Update product rating
    await this.updateProductRating(review.product_id.toString())

    return true
  }

  /**
   * Xóa review
   */
  async deleteReview(review_id: string, user_id: string) {
    const reviewId = new ObjectId(review_id)
    const userId = new ObjectId(user_id)

    const review = await databaseServices.reviews.findOne({
      _id: reviewId,
      user_id: userId
    })

    if (!review) {
      throw new Error('Review not found or you do not have permission to delete it')
    }

    await databaseServices.reviews.deleteOne({ _id: reviewId })

    // Update product rating
    await this.updateProductRating(review.product_id.toString())

    return true
  }

  /**
   * Mark review as helpful
   * Mỗi user chỉ được vote 1 lần, có thể toggle (bỏ vote)
   */
  async markHelpful(review_id: string, user_id: string, helpful: boolean) {
    const reviewId = new ObjectId(review_id)
    const userId = new ObjectId(user_id)

    const review = await databaseServices.reviews.findOne({ _id: reviewId })
    if (!review) {
      throw new Error('Review not found')
    }

    const helpfulUsers = review.helpful_users || []
    const hasVoted = helpfulUsers.some((id) => id.toString() === user_id)

    if (helpful && !hasVoted) {
      // User chưa vote, thêm vote
      await databaseServices.reviews.updateOne(
        { _id: reviewId },
        {
          $inc: { helpful_count: 1 },
          $push: { helpful_users: userId }
        }
      )
      return { voted: true, helpful_count: (review.helpful_count || 0) + 1 }
    } else if (!helpful && hasVoted) {
      // User đã vote, bỏ vote
      await databaseServices.reviews.updateOne(
        { _id: reviewId },
        {
          $inc: { helpful_count: -1 },
          $pull: { helpful_users: userId }
        }
      )
      return { voted: false, helpful_count: Math.max(0, (review.helpful_count || 0) - 1) }
    } else if (helpful && hasVoted) {
      // User đã vote rồi, không làm gì
      return { voted: true, helpful_count: review.helpful_count || 0 }
    } else {
      // User chưa vote và muốn bỏ vote, không làm gì
      return { voted: false, helpful_count: review.helpful_count || 0 }
    }
  }

  /**
   * Tính lại và update rating của product
   */
  async updateProductRating(product_id: string) {
    const productId = new ObjectId(product_id)

    const reviews = await databaseServices.reviews
      .find({
        product_id: productId,
        status: ReviewStatus.Approved
      })
      .toArray()

    if (reviews.length === 0) {
      // Nếu không có review, set rating về 0
      await databaseServices.products.updateOne({ _id: productId }, { $set: { rating: 0 } })
      return
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length
    const roundedRating = Math.round(averageRating * 10) / 10 // Round to 1 decimal

    await databaseServices.products.updateOne({ _id: productId }, { $set: { rating: roundedRating } })
  }

  /**
   * Admin: Get all reviews với pagination và filters
   */
  async getAllReviews(page: number = 1, limit: number = 20, status?: ReviewStatus, product_id?: string) {
    const skip = (page - 1) * limit
    const filter: any = {}

    if (status) {
      filter.status = status
    }

    if (product_id) {
      filter.product_id = new ObjectId(product_id)
    }

    const [reviews, total] = await Promise.all([
      databaseServices.reviews
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.reviews.countDocuments(filter)
    ])

    // Populate user and product info
    const userIds = Array.from(new Set(reviews.map((r) => r.user_id.toString()))).map((id) => new ObjectId(id))
    const productIds = Array.from(new Set(reviews.map((r) => r.product_id.toString()))).map((id) => new ObjectId(id))

    const [users, products] = await Promise.all([
      userIds.length ? databaseServices.users.find({ _id: { $in: userIds } }).toArray() : [],
      productIds.length ? databaseServices.products.find({ _id: { $in: productIds } }).toArray() : []
    ])

    const userMap = new Map(users.map((u) => [u._id?.toString(), u]))
    const productMap = new Map(products.map((p) => [p._id?.toString(), p]))

    const reviewsWithDetails = reviews.map((review) => {
      const user = userMap.get(review.user_id.toString())
      return {
        ...review,
        user: user
          ? {
              _id: user._id?.toString(),
              name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Người dùng',
              email: user.email,
              avatar_url: user.avatar || user.avatar_url
            }
          : null,
        product: productMap.get(review.product_id.toString()) || null
      }
    })

    return {
      reviews: reviewsWithDetails,
      pagination: {
        page,
        limit,
        total,
        total_page: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Admin: Approve/Reject review
   */
  async moderateReview(review_id: string, status: ReviewStatus) {
    const reviewId = new ObjectId(review_id)

    const review = await databaseServices.reviews.findOne({ _id: reviewId })
    if (!review) {
      throw new Error('Review not found')
    }

    await databaseServices.reviews.updateOne({ _id: reviewId }, { $set: { status, updated_at: new Date() } })

    // Update product rating nếu status thay đổi
    await this.updateProductRating(review.product_id.toString())

    return true
  }
}

export default new ReviewsService()

