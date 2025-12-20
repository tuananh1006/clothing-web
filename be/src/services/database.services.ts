import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/Users.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
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
}
export default new DatabaseService()
