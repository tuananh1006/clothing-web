import databaseServices from '~/services/database.services'
import Category from '~/models/schemas/Category.schema'
import Product from '~/models/schemas/Product.schema'
import { config } from 'dotenv'

config()

const categories = [
  {
    name: 'Áo',
    slug: 'ao',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD32BwQOKSMpvyvvDstxM5q9o58VWBO4M7-MFry-5svPJM5ZywFlScSUVb_hbpWOxCiI97XcbD0XPbISq721SmN8aRYESZuWOqdOKyxb-eNZd1GsSSSrMJmtIa4hIjWHBquuS0q8zc2ztRwHoZpls2qiL4H0CnBIv5xuYiWb8FKrl4-nwcVQQQUBooKv-m2LXv6ZcFVcoZMIHrmBBPyOW5Jf0R5KdgAvQQWF4KOovFg0gQOBTBklznNwSv18fqJ6wbYKGySGHaxH-g',
    description: 'Cotton thoáng mát cho mọi ngày',
    is_featured: true
  },
  {
    name: 'Quần',
    slug: 'quan',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    description: 'Kiểu dáng vừa vặn, tối giản',
    is_featured: true
  },
  {
    name: 'Áo khoác',
    slug: 'ao-khoac',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIvlHRsF7TPQg_OSUOj-WKFR6qpr7ELfxG8maqgSz7MNvTTjVVR17m-Jk3Axts_c_PxN4_VNvvQg-fYC1ugKsUPUOGPZV2NxNv9-UY_hWp_436KXYy9QDkEx2jWID6xqLhEMLP6B0B4lK_IBIsAk4u9kPgVz1cWqDA8iYlOsPnXkYz9OkcZNaXcu94QAPG6ukqfyn2bIT699lLvBvViGtBDSzw_kkf2zuuVWEcdt7VoryzLiW1I7qwqT0DAgSv5YLhm55C_PLZ16I',
    description: 'Lớp bảo vệ phong cách',
    is_featured: true
  }
]

const products = [
  {
    name: 'YORI Classic Linen Shirt',
    slug: 'yori-classic-linen-shirt',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2SbPWcG_w9ynyXiqBt_-u8xL-eXcKWk-lsg2FwvYH9_5_XRTJz-UnRd8weKvTeMJvCeOm_2Dp8JKe0uxy4ONRGcOqwdS0-NevMl4W0YRj-QlxJV0PKM7DDbLvO_DL1Oo2Pb622mT6qo0r5qn62ZA2VYi4_5m9HDoJKDRqKGBreXsFqXCYmVbWD3XZhk1z1d868dXZ6Il3hn8KyAJLudFv-Y2xUfbXaPktavITMjD4Hb710BpTWpBIEDU8CZaUMkj1RTYdB4w0Z-4',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2SbPWcG_w9ynyXiqBt_-u8xL-eXcKWk-lsg2FwvYH9_5_XRTJz-UnRd8weKvTeMJvCeOm_2Dp8JKe0uxy4ONRGcOqwdS0-NevMl4W0YRj-QlxJV0PKM7DDbLvO_DL1Oo2Pb622mT6qo0r5qn62ZA2VYi4_5m9HDoJKDRqKGBreXsFqXCYmVbWD3XZhk1z1d868dXZ6Il3hn8KyAJLudFv-Y2xUfbXaPktavITMjD4Hb710BpTWpBIEDU8CZaUMkj1RTYdB4w0Z-4'
    ],
    description: 'Relaxed Fit',
    category_slug: 'ao',
    price: 850000,
    quantity: 100,
    sold: 20,
    view: 150,
    rating: 4.8,
    colors: ['White', 'Beige', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true
  },
  {
    name: 'Heavyweight Cotton Tee',
    slug: 'heavyweight-cotton-tee',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514'
    ],
    description: 'Oversized Fit',
    category_slug: 'ao',
    price: 450000,
    price_before_discount: 600000,
    quantity: 200,
    sold: 50,
    view: 300,
    rating: 4.5,
    colors: ['White', 'Black', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: true
  },
  {
    name: 'Everyday Soft Blazer',
    slug: 'everyday-soft-blazer',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQLVKlOVJToT7CiwHp4A6RFjiuyt9EVUus0ZwtBIvZyE1QGJrI_Xm32qT2wEVC26Ggc0p6Ng0oIAeuI1YGAUbwD-JMJcNkXpLTsM6PakWTkBVEjEOQ2PAVYOnELwq6HJzelTB8112o-jJO0MA2QCsUrVm9cXYKQ6-vpgknLUQ4LUUe-DpOyXBgIj5x_hEi7df4HEn7cNHC9NpozFodN8Md9B1u6bcCZmJ828sCHhXoBasX-2zO-bc7whhQwz3kIUySptQBddj26Kw',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQLVKlOVJToT7CiwHp4A6RFjiuyt9EVUus0ZwtBIvZyE1QGJrI_Xm32qT2wEVC26Ggc0p6Ng0oIAeuI1YGAUbwD-JMJcNkXpLTsM6PakWTkBVEjEOQ2PAVYOnELwq6HJzelTB8112o-jJO0MA2QCsUrVm9cXYKQ6-vpgknLUQ4LUUe-DpOyXBgIj5x_hEi7df4HEn7cNHC9NpozFodN8Md9B1u6bcCZmJ828sCHhXoBasX-2zO-bc7whhQwz3kIUySptQBddj26Kw'
    ],
    description: 'Regular Fit',
    category_slug: 'ao-khoac',
    price: 1850000,
    quantity: 50,
    sold: 5,
    view: 80,
    rating: 5.0,
    colors: ['Black', 'Navy', 'Charcoal'],
    sizes: ['46', '48', '50', '52'],
    is_featured: false
  },
  {
    name: 'Washed Denim Shirt',
    slug: 'washed-denim-shirt',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ'
    ],
    description: 'Standard Fit',
    category_slug: 'ao',
    price: 750000,
    price_before_discount: 950000,
    quantity: 80,
    sold: 15,
    view: 120,
    rating: 4.2,
    colors: ['Light Blue', 'Indigo'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true
  },
  {
    name: 'Tech Nylon Bomber',
    slug: 'tech-nylon-bomber',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8PqMNRzv-awR8FNbdrkn9Wu3jRJ9AlzHpny5PkESaWxR1-R8MjtRBshL_pNlAyNCMvWYnfxwVi411960xDwPEKcD_GQXc-xOiFI9YCQFmGKjUDMu3LAi0fwiXjC2QIhMklQUgIVvXT7xsTd6E_gCRctt9LGP4bF_-nmaXkfIbqG21RH8ZG60TmL4_jMNZ4XKmntErWQk8LC2Pq4KHr2bvHdKScho17QQke7qrTSogtxzB7Pa_2aP3xRE4FyIjt7XtIIz2z-OxtEY',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8PqMNRzv-awR8FNbdrkn9Wu3jRJ9AlzHpny5PkESaWxR1-R8MjtRBshL_pNlAyNCMvWYnfxwVi411960xDwPEKcD_GQXc-xOiFI9YCQFmGKjUDMu3LAi0fwiXjC2QIhMklQUgIVvXT7xsTd6E_gCRctt9LGP4bF_-nmaXkfIbqG21RH8ZG60TmL4_jMNZ4XKmntErWQk8LC2Pq4KHr2bvHdKScho17QQke7qrTSogtxzB7Pa_2aP3xRE4FyIjt7XtIIz2z-OxtEY'
    ],
    description: 'Water Resistant',
    category_slug: 'ao-khoac',
    price: 1250000,
    quantity: 60,
    sold: 8,
    view: 90,
    rating: 4.7,
    colors: ['Black', 'Olive', 'Navy'],
    sizes: ['M', 'L', 'XL'],
    is_featured: false
  },
  {
    name: 'Premium Oxford Shirt',
    slug: 'premium-oxford-shirt',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBii9aC3n0vjWHROFX5yoc8C93X1sljy6HKHy8ERiOcq4XAvT9G1jtmIxn_9hm2jDfjWEpFMQF-erKoiP1mbBhUAbVtGnHELL2iylca1SEAQOivaS_oTzenIzBihoOBresUkn8hVLPCRI9HkgQ4Sw5zPcaXyxwddxYkJ_1AnTSDF2EAAutMH7pH_ZRPcvNjDjDMcerXmPGouOhuFvZZQ2lR79HtzFc8KkPr6SiLu07vrL06NVTcB27GcBUgA4mpaPoXh8jLlbdTnzc',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBii9aC3n0vjWHROFX5yoc8C93X1sljy6HKHy8ERiOcq4XAvT9G1jtmIxn_9hm2jDfjWEpFMQF-erKoiP1mbBhUAbVtGnHELL2iylca1SEAQOivaS_oTzenIzBihoOBresUkn8hVLPCRI9HkgQ4Sw5zPcaXyxwddxYkJ_1AnTSDF2EAAutMH7pH_ZRPcvNjDjDMcerXmPGouOhuFvZZQ2lR79HtzFc8KkPr6SiLu07vrL06NVTcB27GcBUgA4mpaPoXh8jLlbdTnzc'
    ],
    description: 'Slim Fit',
    category_slug: 'ao',
    price: 650000,
    quantity: 120,
    sold: 30,
    view: 200,
    rating: 4.6,
    colors: ['White', 'Blue', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true
  }
]

async function seed() {
  try {
    await databaseServices.connect()

    // Seed Categories
    const categoryCount = await databaseServices.categories.countDocuments()
    if (categoryCount === 0) {
      const categoryDocs = categories.map((cat) => new Category(cat))
      await databaseServices.categories.insertMany(categoryDocs)
      console.log('Seed categories successfully!')
    } else {
      console.log('Categories already exist. Skipping seed categories.')
    }

    // Seed Products
    await databaseServices.products.deleteMany({})
    const categoryDocs = await databaseServices.categories.find().toArray()
    const productDocs = products.map((prod) => {
      const category = categoryDocs.find((c) => c.slug === prod.category_slug)
      if (!category) {
        throw new Error(`Category not found for product ${prod.name}`)
      }
      return new Product({
        ...prod,
        category: category._id as any
      })
    })
    await databaseServices.products.insertMany(productDocs)
    console.log('Seed products successfully!')

    // Create Text Index for Search
    await databaseServices.products.createIndex({ name: 'text', description: 'text' })
    console.log('Create text index for products successfully!')

    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  }
}

seed()
