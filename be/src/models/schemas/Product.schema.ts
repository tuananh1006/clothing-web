import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  slug: string
  image: string
  images?: string[]
  description?: string
  category: ObjectId
  price: number
  price_before_discount?: number
  quantity: number
  sold?: number
  view?: number
  rating?: number
  colors?: string[]
  sizes?: string[]
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  name: string
  slug: string
  image: string
  images: string[]
  description: string
  category: ObjectId
  price: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  rating: number
  colors: string[]
  sizes: string[]
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    this._id = product._id
    this.name = product.name
    this.slug = product.slug
    this.image = product.image
    this.images = product.images || []
    this.description = product.description || ''
    this.category = product.category
    this.price = product.price
    this.price_before_discount = product.price_before_discount || product.price
    this.quantity = product.quantity
    this.sold = product.sold || 0
    this.view = product.view || 0
    this.rating = product.rating || 0
    this.colors = product.colors || []
    this.sizes = product.sizes || []
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
