import databaseServices from './database.services'

class CategoriesService {
  async getCategories({ is_featured, limit }: { is_featured?: boolean; limit?: number }) {
    const filter: any = {}
    if (is_featured) {
      filter.is_featured = true
    }

    const cursor = databaseServices.categories.find(filter)

    if (limit) {
      cursor.limit(limit)
    }

    const categories = await cursor.toArray()
    return categories
  }
}

const categoriesService = new CategoriesService()
export default categoriesService
