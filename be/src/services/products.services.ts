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

    // Hiển thị sản phẩm active, low_stock, hoặc out_of_stock (không hiển thị inactive hoặc draft)
    filter.status = { $in: ['active', 'low_stock', 'out_of_stock'] }

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

    // Populate category info for each product
    const categoryIds = Array.from(
      new Set(products.map((p) => (p.category ? p.category.toString() : undefined)).filter((v): v is string => Boolean(v)))
    ).map((id) => new ObjectId(id))

    const categories = categoryIds.length
      ? await databaseServices.categories
          .find({ _id: { $in: categoryIds } })
          .toArray()
      : []

    const catMap = new Map(categories.map((c) => [c._id?.toString(), c]))

    // Map products with category info
    const mappedProducts = products.map((p) => {
      const category = p.category ? catMap.get(p.category.toString()) : null
      return {
        ...p,
        _id: p._id?.toString(), // Ensure _id is string
        category: category
          ? {
              _id: category._id?.toString(),
              name: category.name,
              slug: category.slug,
              image: category.image
            }
          : null
      }
    })

    return {
      products: mappedProducts,
      pagination: {
        page,
        limit,
        total_page: Math.ceil(total / limit),
        total
      }
    }
  }

  async getProductDetail(slug: string) {
    const product = await databaseServices.products.findOne({ 
      slug,
      status: { $in: ['active', 'low_stock', 'out_of_stock'] } // Cho xem sản phẩm active, low_stock, hoặc out_of_stock
    })
    if (!product) return null

    // Populate category info
    const category = product.category
      ? await databaseServices.categories.findOne({ _id: product.category })
      : null

    return {
      ...product,
      _id: product._id?.toString(), // Ensure _id is string
      category: category
        ? {
            _id: category._id?.toString(),
            name: category.name,
            slug: category.slug,
            image: category.image,
            description: category.description
          }
        : null
    }
  }

  async getRelatedProducts(slug: string, limit: number = 4) {
    const product = await databaseServices.products.findOne({ slug })
    if (!product) return []

    const relatedProducts = await databaseServices.products
      .find({
        category: product.category,
        slug: { $ne: slug },
        status: { $in: ['active', 'low_stock', 'out_of_stock'] } // Hiển thị sản phẩm active, low_stock, hoặc out_of_stock
      })
      .limit(limit)
      .toArray()

    // Populate category info for related products
    if (relatedProducts.length > 0 && product.category) {
      const category = await databaseServices.categories.findOne({ _id: product.category })
      const categoryInfo = category
        ? {
            _id: category._id?.toString(),
            name: category.name,
            slug: category.slug,
            image: category.image
          }
        : null

      return relatedProducts.map((p) => ({
        ...p,
        _id: p._id?.toString(), // Ensure _id is string
        category: categoryInfo
      }))
    }

    return relatedProducts.map((p) => ({
      ...p,
      _id: p._id?.toString() // Ensure _id is string
    }))
  }
}

const productsService = new ProductsService()
export default productsService
