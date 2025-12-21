import { ObjectId } from 'mongodb'
import databaseServices from './database.services'

class ProductsService {
  async getProducts({
    page = 1,
    limit = 20,
    category_slug,
    name,
    sort_by,
    order,
    price_min,
    price_max,
    rating_filter,
    is_featured
  }: {
    page?: number
    limit?: number
    category_slug?: string
    name?: string
    sort_by?: 'view' | 'sold' | 'price' | 'createdAt'
    order?: 'asc' | 'desc'
    price_min?: number
    price_max?: number
    rating_filter?: number
    is_featured?: boolean
  }) {
    const filter: any = {}

    if (is_featured) {
      filter.is_featured = true
    }

    if (category_slug) {
      const category = await databaseServices.categories.findOne({ slug: category_slug })
      if (category) {
        filter.category = category._id
      }
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' }
    }

    if (price_min !== undefined || price_max !== undefined) {
      filter.price = {}
      if (price_min !== undefined) filter.price.$gte = price_min
      if (price_max !== undefined) filter.price.$lte = price_max
    }

    if (rating_filter) {
      filter.rating = { $gte: rating_filter }
    }

    const sort: any = {}
    if (sort_by) {
      sort[sort_by] = order === 'asc' ? 1 : -1
    } else {
      sort.created_at = -1 // Default sort by new
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      databaseServices.products.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      databaseServices.products.countDocuments(filter)
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total_page: Math.ceil(total / limit)
      }
    }
  }

  async getProductDetail(slug: string) {
    const product = await databaseServices.products.findOne({ slug })
    return product
  }

  async getRelatedProducts(slug: string, limit: number = 4) {
    const product = await databaseServices.products.findOne({ slug })
    if (!product) return []

    const relatedProducts = await databaseServices.products
      .find({
        category: product.category,
        slug: { $ne: slug }
      })
      .limit(limit)
      .toArray()

    return relatedProducts
  }
}

const productsService = new ProductsService()
export default productsService
