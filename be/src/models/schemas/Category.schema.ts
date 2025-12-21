import { ObjectId } from 'mongodb'

interface CategoryType {
  _id?: ObjectId
  name: string
  slug: string
  image?: string
  description?: string
  is_featured?: boolean
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id?: ObjectId
  name: string
  slug: string
  image: string
  description: string
  is_featured: boolean
  created_at: Date
  updated_at: Date

  constructor(category: CategoryType) {
    this._id = category._id
    this.name = category.name || ''
    this.slug = category.slug || ''
    this.image = category.image || ''
    this.description = category.description || ''
    this.is_featured = category.is_featured || false
    this.created_at = category.created_at || new Date()
    this.updated_at = category.updated_at || new Date()
  }
}
