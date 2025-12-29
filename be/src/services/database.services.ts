import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/Users.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Category from '~/models/schemas/Category.schema'
import Product from '~/models/schemas/Product.schema'
import Cart from '~/models/schemas/Cart.schema'
import Order from '~/models/schemas/Order.schema'
import Banner from '~/models/schemas/Banner.schema'
import Review from '~/models/schemas/Review.schema'
config({ quiet: true }) // tuỳ version dotenv

// Connection URL
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@bao.twztptb.mongodb.net/?appName=bao`
const dbName = process.env.DB_NAME || 'test'
class DatabaseService {
  // You can add database related methods here
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(url)
    this.db = this.client.db(dbName)
  }
  async connect() {
    try {
      await this.client.connect()
      console.log('Connected successfully to database')
      const db = this.client.db(dbName)
      return db
    } catch (error) {
      console.error('Error connecting to database:', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_CATEGORIES_COLLECTION as string)
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION as string)
  }

  get carts(): Collection<Cart> {
    return this.db.collection(process.env.DB_CARTS_COLLECTION as string)
  }

  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }

  // Settings collection (singleton document)
  get settings(): Collection<any> {
    return this.db.collection(process.env.DB_SETTINGS_COLLECTION || 'settings')
  }

  // Contacts collection (store contact form submissions)
  get contacts(): Collection<any> {
    return this.db.collection(process.env.DB_CONTACTS_COLLECTION || 'contacts')
  }

  // Banners collection
  get banners(): Collection<Banner> {
    return this.db.collection(process.env.DB_BANNERS_COLLECTION || 'banners')
  }

  // Reviews collection
  get reviews(): Collection<Review> {
    return this.db.collection(process.env.DB_REVIEWS_COLLECTION || 'reviews')
  }
}
export default new DatabaseService()
