import databaseServices from '~/services/database.services'
import Category from '~/models/schemas/Category.schema'
import { config } from 'dotenv'

config()

const categories = [
  {
    name: 'Áo',
    slug: 'ao',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Các loại áo thun, áo sơ mi, áo khoác...',
    is_featured: true
  },
  {
    name: 'Quần',
    slug: 'quan',
    image: 'https://down-vn.img.susercontent.com/file/cn-11134211-7r98o-lxjl531p0ahved',
    description: 'Quần jean, quần tây, quần short...',
    is_featured: true
  },
  {
    name: 'Váy',
    slug: 'vay',
    image:
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Chân váy, đầm liền...',
    is_featured: true
  },
  {
    name: 'Phụ kiện',
    slug: 'phu-kien',
    image:
      'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Nón, túi xách, thắt lưng...',
    is_featured: false
  }
]

async function seed() {
  try {
    await databaseServices.connect()
    const count = await databaseServices.categories.countDocuments()
    if (count > 0) {
      console.log('Categories already exist. Skipping seed.')
      process.exit(0)
    }

    const categoryDocs = categories.map((cat) => new Category(cat))
    await databaseServices.categories.insertMany(categoryDocs)
    console.log('Seed categories successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seed()
