                                                                                                                                                                                                                            /**
 * Seed Data Script
 * 
 * Nguồn dữ liệu: Lấy từ UI files (ui/trangchu.html, ui/categories.html, ui/product.html)
 * 
 * Cách chạy:
 *   - Từ thư mục be: npm run db:seed
 *   - Hoặc: npx ts-node -r tsconfig-paths/register src/utils/seed.ts
 * 
 * Default Admin Credentials:
 *   - Email: admin@yori.com (hoặc từ env ADMIN_EMAIL)
 *   - Password: admin123 (hoặc từ env ADMIN_PASSWORD)
 * 
 * Test User Credentials:
 *   - customer1@test.com / 123456
 *   - customer2@test.com / 123456
 *   - customer3@test.com / 123456
 * 
 * Lưu ý:
 *   - Script sẽ chỉ seed data nếu chưa tồn tại (không xóa data cũ)
 *   - Categories, Products, Banners: chỉ seed nếu collection rỗng
 *   - Users: chỉ tạo nếu email chưa tồn tại
 */

import databaseServices from '../services/database.services'
import Category from '../models/schemas/Category.schema'
import Product, { ProductStatus } from '../models/schemas/Product.schema'
import Banner from '../models/schemas/Banner.schema'
import User from '../models/schemas/Users.schema'
import { hashPassword } from './crypto'
import { UserRole, UserVerifyStatus } from '../constants/enums'
import { config } from 'dotenv'
import { validateAllSeedData } from './validate-seed-data'

config()

/**
 * Categories Seed Data
 * Nguồn: ui/trangchu.html, ui/categories.html
 */
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
  },
  {
    name: 'Đồ Len & Dệt Kim',
    slug: 'do-len-det-kim',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Lm7D1D1o3GUSaDSunJ2gOZxjeZ-odAMibuS7BpqAz2bNkvdaga74ni_BjQnSXRZ0qIrCQLAMu3_rXgjDkzwvFuClJvPpxxvJFVPe3ezVZFWOTD3BshXI8jIM5Tg8QYc3ETGvuzFG0Qb3UJt3Fk3p_6RtCWyuC_RgzMkkC7RjM25MN_LffPEMQHaMjQm5tonOuSgTod31DF4zAyQZClgkuQvJOgC3xa4UAJ-OTmHGFEt8k3xsiq5rmbVIAAbXioxT12bHNfYM0k0',
    description: 'Ấm áp và thoải mái',
    is_featured: false
  },
  {
    name: 'Denim Tối Giản',
    slug: 'denim-toi-gian',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJe-7ApiUsPoFCgiHguEHxxhqylhrdYn8sCAGcfaN3Tn5LwfGTldpUzbVtnmtCVlVPeAEIwPX2EbVqL7PZskI5jov7xrvtHUSvzTpaoUArNNhD0YYZD9FoQpIswHeEZ07BdAuPIuWqAUyOBbnIz8p59LKtLVel7zL7MyqO0kOSDCqVikgPuj-c9a76m6Pr17sO6IY1kEaUJTRcJeneNeYvsKYHFXxSoJTpfUd44c6ooVuATOvL7aDk5oXQvApCrn3Es8UKSgw2gpU',
    description: 'Phong cách denim tối giản',
    is_featured: false
  },
  {
    name: 'Phụ Kiện',
    slug: 'phu-kien',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdYcL7jlW8EOdgxZe_djIC4aQRFoOhZskaFAKCdxReWiP8HtheLwXUAeEwLNKeF64i6tTzD5-Mz1YC-v4VpRakSgY8RnmYoxs97pTOZ5PZVtyCWKemk7xJ1Mfjzsti7me5wJsj3q0K6B7Fk3-W3fLSe4lqLeqPn9Fk9B4ZDzpAwkMMBmV5Bv4l8vUVNtvu-l08qnW8Vmpjlorgnr4WeAQZuHdj-gkNOWT-xDOBUzszEEMUj1gd_5KO27RQcvzOCPR3Thaz_X3IeK0',
    description: 'Phụ kiện hoàn thiện phong cách',
    is_featured: false
  }
]

/**
 * Products Seed Data
 * Nguồn: ui/trangchu.html, ui/product.html, ui/categories.html
 * 
 * Products được lấy từ:
 *   - Featured products section (trangchu.html)
 *   - Best sellers section (trangchu.html)
 *   - Product listings (product.html, categories.html)
 */
const products = [
  {
    name: 'Áo sơ mi Linen',
    slug: 'ao-so-mi-linen',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'
    ],
    description: 'Relaxed Fit - Áo sơ mi linen thoáng mát, phù hợp cho mọi dịp',
    category_slug: 'ao',
    price: 850000,
    quantity: 100,
    sold: 20,
    view: 150,
    rating: 4.8,
    colors: ['Beige', 'Trắng'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần ống rộng Taki',
    slug: 'quan-ong-rong-taki',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'
    ],
    description: 'Regular Fit - Quần ống rộng phong cách tối giản',
    category_slug: 'quan',
    price: 650000,
    quantity: 80,
    sold: 15,
    view: 120,
    rating: 4.5,
    colors: ['Xám khói'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo thun Cotton Basic',
    slug: 'ao-thun-cotton-basic',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'
    ],
    description: 'Regular Fit - Áo thun cotton cơ bản, thoải mái',
    category_slug: 'ao',
    price: 350000,
    quantity: 200,
    sold: 50,
    view: 300,
    rating: 4.4,
    colors: ['Trắng tinh khôi'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo khoác Blazer Kaki',
    slug: 'ao-khoac-blazer-kaki',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'
    ],
    description: 'Regular Fit - Áo khoác blazer kaki thanh lịch',
    category_slug: 'ao-khoac',
    price: 950000,
    quantity: 50,
    sold: 25,
    view: 200,
    rating: 4.9,
    colors: ['Xám', 'Navy', 'Đen'],
    sizes: ['46', '48', '50', '52'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Sơ mi lụa Muji',
    slug: 'so-mi-lua-muji',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I'
    ],
    description: 'Regular Fit - Sơ mi lụa mềm mại, thanh lịch',
    category_slug: 'ao',
    price: 720000,
    quantity: 70,
    sold: 30,
    view: 180,
    rating: 4.7,
    colors: ['Trắng', 'Beige', 'Hồng nhạt'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Tây Chinos',
    slug: 'quan-tay-chinos',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'
    ],
    description: 'Regular Fit - Quần tây chinos lịch sự, đa dụng',
    category_slug: 'quan',
    price: 680000,
    quantity: 90,
    sold: 35,
    view: 220,
    rating: 4.8,
    colors: ['Navy', 'Xám', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Oversized Tee',
    slug: 'oversized-tee',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514'
    ],
    description: 'Oversized Fit - Áo thun oversized thoải mái',
    category_slug: 'ao',
    price: 450000,
    price_before_discount: 600000,
    quantity: 200,
    sold: 50,
    view: 300,
    rating: 4.5,
    colors: ['White', 'Black', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Casual Shorts',
    slug: 'casual-shorts',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'
    ],
    description: 'Regular Fit - Quần short casual thoải mái',
    category_slug: 'quan',
    price: 380000,
    quantity: 120,
    sold: 25,
    view: 150,
    rating: 4.3,
    colors: ['Beige', 'Navy', 'Đen'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Denim Jacket',
    slug: 'denim-jacket',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ'
    ],
    description: 'Regular Fit - Áo khoác denim phong cách',
    category_slug: 'ao-khoac',
    price: 890000,
    quantity: 70,
    sold: 12,
    view: 110,
    rating: 4.4,
    colors: ['Light Blue', 'Indigo', 'Đen'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  // Thêm nhiều sản phẩm Áo
  {
    name: 'Áo Polo Cotton',
    slug: 'ao-polo-cotton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Áo polo cotton lịch sự, thoải mái',
    category_slug: 'ao',
    price: 550000,
    quantity: 150,
    sold: 45,
    view: 280,
    rating: 4.6,
    colors: ['Trắng', 'Navy', 'Xám', 'Đen'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Kẻ Sọc',
    slug: 'ao-so-mi-ke-soc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Regular Fit - Áo sơ mi kẻ sọc thanh lịch, phù hợp công sở',
    category_slug: 'ao',
    price: 780000,
    quantity: 90,
    sold: 28,
    view: 190,
    rating: 4.7,
    colors: ['Xanh trắng', 'Đỏ trắng', 'Navy trắng'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun V-Neck',
    slug: 'ao-thun-v-neck',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Áo thun V-neck cổ điển, dễ phối đồ',
    category_slug: 'ao',
    price: 320000,
    quantity: 180,
    sold: 65,
    view: 350,
    rating: 4.5,
    colors: ['Trắng', 'Đen', 'Xám', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Dài Tay',
    slug: 'ao-so-mi-dai-tay',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Regular Fit - Áo sơ mi dài tay lịch sự, chất liệu cao cấp',
    category_slug: 'ao',
    price: 920000,
    quantity: 75,
    sold: 22,
    view: 160,
    rating: 4.8,
    colors: ['Trắng', 'Xanh nhạt', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Tay Ngắn',
    slug: 'ao-thun-tay-ngan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Áo thun tay ngắn cơ bản, đa dụng',
    category_slug: 'ao',
    price: 280000,
    quantity: 250,
    sold: 80,
    view: 420,
    rating: 4.4,
    colors: ['Trắng', 'Đen', 'Xám', 'Navy', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Cổ Bẻ',
    slug: 'ao-so-mi-co-be',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Regular Fit - Áo sơ mi cổ bẻ thanh lịch, phong cách Hàn Quốc',
    category_slug: 'ao',
    price: 680000,
    quantity: 110,
    sold: 35,
    view: 240,
    rating: 4.6,
    colors: ['Trắng', 'Beige', 'Xanh nhạt'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  // Thêm nhiều sản phẩm Quần
  {
    name: 'Quần Jeans Slim Fit',
    slug: 'quan-jeans-slim-fit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Slim Fit - Quần jeans slim fit phong cách trẻ trung',
    category_slug: 'quan',
    price: 750000,
    quantity: 100,
    sold: 40,
    view: 280,
    rating: 4.7,
    colors: ['Xanh đậm', 'Xanh nhạt', 'Đen'],
    sizes: ['28', '30', '32', '34', '36'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Tây Regular',
    slug: 'quan-tay-regular',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Regular Fit - Quần tây regular lịch sự, phù hợp công sở',
    category_slug: 'quan',
    price: 720000,
    quantity: 85,
    sold: 30,
    view: 200,
    rating: 4.8,
    colors: ['Đen', 'Navy', 'Xám', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jogger',
    slug: 'quan-jogger',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Regular Fit - Quần jogger thể thao, thoải mái',
    category_slug: 'quan',
    price: 520000,
    quantity: 130,
    sold: 55,
    view: 320,
    rating: 4.5,
    colors: ['Đen', 'Xám', 'Navy', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Ống Đứng',
    slug: 'quan-ong-dung',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g'],
    description: 'Regular Fit - Quần ống đứng thanh lịch, tối giản',
    category_slug: 'quan',
    price: 640000,
    quantity: 95,
    sold: 32,
    view: 210,
    rating: 4.6,
    colors: ['Đen', 'Xám khói', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Cargo',
    slug: 'quan-cargo',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Regular Fit - Quần cargo phong cách streetwear',
    category_slug: 'quan',
    price: 580000,
    quantity: 110,
    sold: 28,
    view: 180,
    rating: 4.4,
    colors: ['Đen', 'Xám', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Legging',
    slug: 'quan-legging',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Slim Fit - Quần legging thể thao, co giãn tốt',
    category_slug: 'quan',
    price: 420000,
    quantity: 140,
    sold: 60,
    view: 380,
    rating: 4.6,
    colors: ['Đen', 'Xám', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  // Thêm nhiều sản phẩm Áo khoác
  {
    name: 'Áo Khoác Bomber',
    slug: 'ao-khoac-bomber',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Áo khoác bomber phong cách trẻ trung',
    category_slug: 'ao-khoac',
    price: 880000,
    quantity: 65,
    sold: 18,
    view: 140,
    rating: 4.5,
    colors: ['Đen', 'Navy', 'Xám'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Hoodie',
    slug: 'ao-khoac-hoodie',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Áo khoác hoodie ấm áp, thoải mái',
    category_slug: 'ao-khoac',
    price: 720000,
    quantity: 80,
    sold: 35,
    view: 250,
    rating: 4.7,
    colors: ['Đen', 'Xám', 'Navy', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Windbreaker',
    slug: 'ao-khoac-windbreaker',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Áo khoác windbreaker chống gió, nhẹ',
    category_slug: 'ao-khoac',
    price: 650000,
    quantity: 90,
    sold: 22,
    view: 170,
    rating: 4.6,
    colors: ['Đen', 'Navy', 'Xanh lá'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Trench Coat',
    slug: 'ao-khoac-trench-coat',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Áo khoác trench coat thanh lịch, cổ điển',
    category_slug: 'ao-khoac',
    price: 1200000,
    quantity: 45,
    sold: 15,
    view: 120,
    rating: 4.9,
    colors: ['Beige', 'Đen', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Cardigan',
    slug: 'ao-khoac-cardigan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Áo khoác cardigan ấm áp, dễ phối đồ',
    category_slug: 'ao-khoac',
    price: 680000,
    quantity: 75,
    sold: 20,
    view: 150,
    rating: 4.5,
    colors: ['Beige', 'Xám', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Parka',
    slug: 'ao-khoac-parka',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Áo khoác parka chống nước, ấm áp',
    category_slug: 'ao-khoac',
    price: 1100000,
    quantity: 55,
    sold: 12,
    view: 100,
    rating: 4.8,
    colors: ['Đen', 'Olive', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Linen Gân',
    slug: 'ao-so-mi-linen-gan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Relaxed Fit - Linen gân, mát và nhẹ nhàng.',
    category_slug: 'ao',
    price: 860000,
    quantity: 120,
    sold: 10,
    view: 95,
    rating: 4.6,
    colors: ['Beige', 'Trắng', 'Xanh nhạt'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Organic Tee',
    slug: 'ao-thun-organic-tee',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Cotton hữu cơ, mềm và thân thiện.',
    category_slug: 'ao',
    price: 390000,
    quantity: 220,
    sold: 70,
    view: 480,
    rating: 4.5,
    colors: ['Trắng','Đen','Xám'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Linen Caro',
    slug: 'ao-so-mi-linen-caro',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs'],
    description: 'Relaxed Fit - Linen họa tiết caro nhẹ nhàng.',
    category_slug: 'ao',
    price: 870000,
    quantity: 60,
    sold: 8,
    view: 88,
    rating: 4.4,
    colors: ['Beige','Xanh rêu'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Polo Vintage',
    slug: 'ao-polo-vintage',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Polo phong cách retro, chất cotton dày dặn.',
    category_slug: 'ao',
    price: 600000,
    quantity: 140,
    sold: 38,
    view: 260,
    rating: 4.6,
    colors: ['Navy','Bordeaux','Beige'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Len Mỏng',
    slug: 'ao-len-mong',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Slim Fit - Len mỏng, phù hợp layering mùa se lạnh.',
    category_slug: 'ao',
    price: 720000,
    quantity: 95,
    sold: 27,
    view: 135,
    rating: 4.4,
    colors: ['Beige','Xám','Đen'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Tay Ngắn Resort',
    slug: 'ao-so-mi-tay-ngan-resort',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs'],
    description: 'Relaxed Fit - Họa tiết nhiệt đới, mặc đi chơi hợp lý.',
    category_slug: 'ao',
    price: 520000,
    quantity: 130,
    sold: 22,
    view: 160,
    rating: 4.3,
    colors: ['Trắng họa tiết','Xanh lá họa tiết'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Măng Tô Nhẹ',
    slug: 'ao-khoac-mang-to-nhe',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Trench-light - Măng tô dáng dài, nhẹ, lịch sự.',
    category_slug: 'ao-khoac',
    price: 1250000,
    quantity: 40,
    sold: 6,
    view: 70,
    rating: 4.8,
    colors: ['Beige','Xám'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Short Linen Nữ',
    slug: 'quan-short-linen-nu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Regular Fit - Short linen nữ, nhẹ nhàng, dễ phối.',
    category_slug: 'quan',
    price: 420000,
    quantity: 140,
    sold: 30,
    view: 210,
    rating: 4.4,
    colors: ['Beige','Navy'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Ống Rộng Linen Nam',
    slug: 'quan-ong-rong-linen-nam',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g'],
    description: 'Wide Fit - Quần linen ống rộng, thoáng mát mùa hè.',
    category_slug: 'quan',
    price: 690000,
    quantity: 85,
    sold: 20,
    view: 130,
    rating: 4.5,
    colors: ['Beige','Xám'],
    sizes: ['29','30','31','32'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Tây Vải Cao Cấp',
    slug: 'quan-tay-vai-cao-cap',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Regular Fit - Quần tây vải, phù hợp formal & office.',
    category_slug: 'quan',
    price: 820000,
    quantity: 60,
    sold: 24,
    view: 170,
    rating: 4.7,
    colors: ['Đen','Navy','Xám'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Short Kaki Nam',
    slug: 'quan-short-kaki-nam',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Casual Fit - Short kaki đa dụng cho mùa hè.',
    category_slug: 'quan',
    price: 360000,
    quantity: 160,
    sold: 45,
    view: 300,
    rating: 4.2,
    colors: ['Beige','Olive'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Váy Maxi Hoa Nhí',
    slug: 'vay-maxi-hoa-nhi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs'],
    description: 'Maxi nhẹ nhàng, họa tiết hoa nhí nữ tính.',
    category_slug: 'vay',
    price: 670000,
    quantity: 70,
    sold: 18,
    view: 140,
    rating: 4.6,
    colors: ['Kem','Hồng nhạt'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Denim Oversized',
    slug: 'ao-khoac-denim-oversized',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ'],
    description: 'Oversized Fit - Denim jacket phong cách unisex.',
    category_slug: 'ao-khoac',
    price: 920000,
    quantity: 75,
    sold: 30,
    view: 210,
    rating: 4.5,
    colors: ['Indigo','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Dù Thể Thao',
    slug: 'ao-khoac-du-the-thao',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Windbreaker - Chống gió, phù hợp outdoor & chạy bộ.',
    category_slug: 'ao-khoac',
    price: 660000,
    quantity: 95,
    sold: 21,
    view: 180,
    rating: 4.4,
    colors: ['Đen','Xanh lá'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Dép Sandal Da',
    slug: 'dep-sandal-da',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Sandal da thật, đế êm, phù hợp mùa hè.',
    category_slug: 'giay',
    price: 480000,
    quantity: 130,
    sold: 55,
    view: 310,
    rating: 4.5,
    colors: ['Nâu','Đen'],
    sizes: ['38','39','40','41'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Giày Sneaker Canvas',
    slug: 'giay-sneaker-canvas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514'],
    description: 'Sneaker canvas nhẹ, dễ phối đồ hàng ngày.',
    category_slug: 'giay',
    price: 720000,
    quantity: 110,
    sold: 48,
    view: 260,
    rating: 4.5,
    colors: ['Trắng','Đen','Navy'],
    sizes: ['38','39','40','41','42'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Bộ Đồ Tập Gym Nữ',
    slug: 'bo-do-tap-gym-nu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Set 2 món: bra + legging co dãn, thấm hút tốt.',
    category_slug: 'do-tap',
    price: 690000,
    quantity: 140,
    sold: 60,
    view: 380,
    rating: 4.6,
    colors: ['Đen','Xanh rêu'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Đầm Dự Tiệc Lụa',
    slug: 'dam-du-tiec-lua',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs'],
    description: 'Đầm lụa sang trọng, phù hợp dự tiệc hoặc event.',
    category_slug: 'vay',
    price: 1250000,
    quantity: 35,
    sold: 7,
    view: 90,
    rating: 4.9,
    colors: ['Đỏ ruby','Đen'],
    sizes: ['S','M','L'],
    is_featured: true,
    status: ProductStatus.Active
  },  // --- Bắt đầu bổ sung 100 mẫu (áo / quần / áo khoác) ---
  {
    name: 'Áo Thun Basic 001',
    slug: 'ao-thun-basic-001',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Áo thun basic, dễ phối, vải cotton mềm.',
    category_slug: 'ao',
    price: 290000,
    quantity: 200,
    sold: 34,
    view: 410,
    rating: 4.4,
    colors: ['Trắng','Đen','Xám'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Basic 002',
    slug: 'ao-thun-basic-002',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Áo thun basic, vải dày hơn, form chuẩn.',
    category_slug: 'ao',
    price: 320000,
    quantity: 180,
    sold: 45,
    view: 360,
    rating: 4.5,
    colors: ['Trắng','Navy'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Basic 003',
    slug: 'ao-thun-basic-003',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Slim Fit - Áo thun ôm nhẹ, chất cotton co giãn.',
    category_slug: 'ao',
    price: 310000,
    quantity: 150,
    sold: 52,
    view: 420,
    rating: 4.6,
    colors: ['Đen','Xám','Beige'],
    sizes: ['S','M','L'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Polo Basic 004',
    slug: 'ao-polo-basic-004',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Regular Fit - Polo cổ bẻ, vải piqué thoáng mát.',
    category_slug: 'ao',
    price: 560000,
    quantity: 140,
    sold: 30,
    view: 270,
    rating: 4.6,
    colors: ['Trắng','Navy','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Casual 005',
    slug: 'ao-so-mi-casual-005',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Regular Fit - Sơ mi casual, vải cotton pha, thoáng.',
    category_slug: 'ao',
    price: 720000,
    quantity: 85,
    sold: 22,
    view: 190,
    rating: 4.7,
    colors: ['Trắng','Xanh nhạt','Beige'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Casual 006',
    slug: 'ao-so-mi-casual-006',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Slim Fit - Sơ mi casual ôm nhẹ, phong cách Hàn.',
    category_slug: 'ao',
    price: 740000,
    quantity: 70,
    sold: 18,
    view: 150,
    rating: 4.6,
    colors: ['Trắng','Navy'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Bomber 007',
    slug: 'ao-khoac-bomber-007',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Bomber jacket, vải chống gió, phong cách.',
    category_slug: 'ao-khoac',
    price: 880000,
    quantity: 60,
    sold: 12,
    view: 140,
    rating: 4.5,
    colors: ['Đen','Xám','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Hoodie 008',
    slug: 'ao-khoac-hoodie-008',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Regular Fit - Hoodie dày, ấm áp, có túi trước.',
    category_slug: 'ao-khoac',
    price: 760000,
    quantity: 110,
    sold: 36,
    view: 260,
    rating: 4.7,
    colors: ['Đen','Beige','Navy'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jeans Slim 009',
    slug: 'quan-jeans-slim-009',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Slim Fit - Jeans stretch, thoải mái, trẻ trung.',
    category_slug: 'quan',
    price: 760000,
    quantity: 100,
    sold: 42,
    view: 280,
    rating: 4.7,
    colors: ['Xanh đậm','Đen'],
    sizes: ['28','30','32','34'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jogger 010',
    slug: 'quan-jogger-010',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Regular Fit - Jogger thể thao, co giãn, phù hợp gym & daily.',
    category_slug: 'quan',
    price: 520000,
    quantity: 130,
    sold: 55,
    view: 320,
    rating: 4.5,
    colors: ['Đen','Xám','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Kaki 011',
    slug: 'quan-kaki-011',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Regular Fit - Kaki vải dày, phù hợp office & casual.',
    category_slug: 'quan',
    price: 680000,
    quantity: 95,
    sold: 32,
    view: 210,
    rating: 4.6,
    colors: ['Beige','Navy','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Tây Chinos 012',
    slug: 'quan-chinos-012',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Regular Fit - Chinos thanh lịch, dễ chịu khi mặc.',
    category_slug: 'quan',
    price: 700000,
    quantity: 80,
    sold: 28,
    view: 220,
    rating: 4.8,
    colors: ['Navy','Xám','Beige'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Windbreaker 013',
    slug: 'ao-khoac-windbreaker-013',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Chống gió, nhẹ, phù hợp đi phượt & chạy bộ.',
    category_slug: 'ao-khoac',
    price: 640000,
    quantity: 90,
    sold: 22,
    view: 170,
    rating: 4.6,
    colors: ['Đen','Navy','Xanh lá'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Trench 014',
    slug: 'ao-khoac-trench-014',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Trench coat thanh lịch, form dài, phù hợp formal.',
    category_slug: 'ao-khoac',
    price: 1200000,
    quantity: 45,
    sold: 15,
    view: 120,
    rating: 4.9,
    colors: ['Beige','Đen','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Len Mỏng 015',
    slug: 'ao-len-mong-015',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Len mỏng, thích hợp layering, form ôm nhẹ.',
    category_slug: 'ao',
    price: 720000,
    quantity: 95,
    sold: 27,
    view: 135,
    rating: 4.4,
    colors: ['Beige','Xám','Đen'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Oversize 016',
    slug: 'ao-thun-oversize-016',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514'],
    description: 'Oversized Fit - Áo thun form rộng, phong cách unisex.',
    category_slug: 'ao',
    price: 450000,
    price_before_discount: 600000,
    quantity: 200,
    sold: 50,
    view: 300,
    rating: 4.5,
    colors: ['White','Black','Grey'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Linen 017',
    slug: 'ao-so-mi-linen-017',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Relaxed Fit - Linen thoáng mát, thích hợp mùa hè.',
    category_slug: 'ao',
    price: 850000,
    quantity: 100,
    sold: 20,
    view: 150,
    rating: 4.8,
    colors: ['Beige','Trắng'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Ống Rộng Taki 018',
    slug: 'quan-ong-rong-taki-018',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g'],
    description: 'Regular Fit - Quần ống rộng phong cách tối giản.',
    category_slug: 'quan',
    price: 650000,
    quantity: 80,
    sold: 15,
    view: 120,
    rating: 4.5,
    colors: ['Xám khói'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jeans Rách 019',
    slug: 'quan-jeans-rach-019',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Slim Fit - Jeans rách nhẹ, phong cách streetwear.',
    category_slug: 'quan',
    price: 780000,
    quantity: 95,
    sold: 33,
    view: 260,
    rating: 4.6,
    colors: ['Xanh nhạt','Xanh đậm'],
    sizes: ['28','30','32','34'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Denim 020',
    slug: 'ao-khoac-denim-020',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ'],
    description: 'Regular Fit - Denim jacket classic, bền và thời trang.',
    category_slug: 'ao-khoac',
    price: 890000,
    quantity: 70,
    sold: 12,
    view: 110,
    rating: 4.4,
    colors: ['Light Blue','Indigo','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Parka 021',
    slug: 'ao-khoac-parka-021',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Parka chống nước, giữ ấm, phù hợp trời lạnh.',
    category_slug: 'ao-khoac',
    price: 1100000,
    quantity: 55,
    sold: 12,
    view: 100,
    rating: 4.8,
    colors: ['Đen','Olive','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Polo Sport 022',
    slug: 'ao-polo-sport-022',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Polo thể thao, thoáng khí, thấm hút mồ hôi.',
    category_slug: 'ao',
    price: 580000,
    quantity: 150,
    sold: 44,
    view: 300,
    rating: 4.5,
    colors: ['Trắng','Xanh lá'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Graphic 023',
    slug: 'ao-thun-graphic-023',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514'],
    description: 'Graphic Tee - Họa tiết in nổi bật, phong cách trẻ.',
    category_slug: 'ao',
    price: 380000,
    quantity: 160,
    sold: 74,
    view: 490,
    rating: 4.4,
    colors: ['Trắng họa tiết','Đen họa tiết'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Henley 024',
    slug: 'ao-thun-henley-024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Henley shirt - cổ khuy, phong cách lịch sự nhưng casual.',
    category_slug: 'ao',
    price: 420000,
    quantity: 140,
    sold: 38,
    view: 220,
    rating: 4.3,
    colors: ['Trắng','Xám','Đen'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Cardigan 025',
    slug: 'ao-khoac-cardigan-025',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Cardigan mỏng, dễ phối, phù hợp layering mùa thu.',
    category_slug: 'ao-khoac',
    price: 680000,
    quantity: 75,
    sold: 20,
    view: 150,
    rating: 4.5,
    colors: ['Beige','Xám','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Legging 026',
    slug: 'quan-legging-026',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Slim Fit - Legging co dãn, phù hợp tập luyện.',
    category_slug: 'quan',
    price: 420000,
    quantity: 140,
    sold: 60,
    view: 380,
    rating: 4.6,
    colors: ['Đen','Xám','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Short Denim 027',
    slug: 'quan-short-denim-027',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Short denim năng động, mùa hè dễ chịu.',
    category_slug: 'quan',
    price: 420000,
    quantity: 120,
    sold: 25,
    view: 150,
    rating: 4.3,
    colors: ['Xanh','Đen'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Lụa 028',
    slug: 'ao-so-mi-lua-028',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I'],
    description: 'Sơ mi lụa mềm mại, thanh lịch cho công sở và event.',
    category_slug: 'ao',
    price: 720000,
    quantity: 70,
    sold: 30,
    view: 180,
    rating: 4.7,
    colors: ['Trắng','Beige','Hồng nhạt'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Ống Đứng 029',
    slug: 'quan-ong-dung-029',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g'],
    description: 'Quần ống đứng tối giản, phù hợp công sở.',
    category_slug: 'quan',
    price: 640000,
    quantity: 95,
    sold: 32,
    view: 210,
    rating: 4.6,
    colors: ['Đen','Xám khói','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Tay Ngắn 030',
    slug: 'ao-thun-tay-ngan-030',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Áo thun tay ngắn cơ bản, đa dụng cho hàng ngày.',
    category_slug: 'ao',
    price: 280000,
    quantity: 250,
    sold: 80,
    view: 420,
    rating: 4.4,
    colors: ['Trắng','Đen','Xám','Navy','Beige'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Dài Tay 031',
    slug: 'ao-so-mi-dai-tay-031',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Sơ mi dài tay chất liệu cao cấp, lịch sự.',
    category_slug: 'ao',
    price: 920000,
    quantity: 75,
    sold: 22,
    view: 160,
    rating: 4.8,
    colors: ['Trắng','Xanh nhạt','Beige'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Kẻ Sọc 032',
    slug: 'ao-so-mi-ke-soc-032',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Sơ mi kẻ sọc công sở, phong cách tinh tế.',
    category_slug: 'ao',
    price: 780000,
    quantity: 90,
    sold: 28,
    view: 190,
    rating: 4.7,
    colors: ['Xanh trắng','Đỏ trắng','Navy trắng'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Cổ Bẻ 033',
    slug: 'ao-so-mi-co-be-033',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Sơ mi cổ bẻ, phong cách Hàn Quốc, dễ phối đồ.',
    category_slug: 'ao',
    price: 680000,
    quantity: 110,
    sold: 35,
    view: 240,
    rating: 4.6,
    colors: ['Trắng','Beige','Xanh nhạt'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Bomber 034',
    slug: 'ao-khoac-bomber-034',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Bomber jacket nhẹ, form gọn, phối layer ổn.',
    category_slug: 'ao-khoac',
    price: 900000,
    quantity: 55,
    sold: 14,
    view: 160,
    rating: 4.5,
    colors: ['Đen','Navy'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Oxford 035',
    slug: 'ao-so-mi-oxford-035',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY'],
    description: 'Oxford shirt classic, vải dày, phù hợp công sở.',
    category_slug: 'ao',
    price: 820000,
    quantity: 88,
    sold: 29,
    view: 200,
    rating: 4.7,
    colors: ['Trắng','Xanh','Hồng nhạt'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jeans Loose 036',
    slug: 'quan-jeans-loose-036',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Loose fit jeans, thoải mái, phong cách retro.',
    category_slug: 'quan',
    price: 820000,
    quantity: 90,
    sold: 26,
    view: 230,
    rating: 4.5,
    colors: ['Xanh đậm','Xanh nhạt'],
    sizes: ['30','32','34','36'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Denim Oversize 037',
    slug: 'ao-khoac-denim-oversize-037',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ'],
    description: 'Denim oversized unisex, phong cách đường phố.',
    category_slug: 'ao-khoac',
    price: 920000,
    quantity: 75,
    sold: 30,
    view: 210,
    rating: 4.5,
    colors: ['Indigo','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Windbreaker 038',
    slug: 'ao-khoac-windbreaker-038',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Windbreaker nhẹ, chống gió và nước nhẹ.',
    category_slug: 'ao-khoac',
    price: 680000,
    quantity: 90,
    sold: 20,
    view: 180,
    rating: 4.4,
    colors: ['Xanh lá','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Linen 039',
    slug: 'ao-so-mi-linen-039',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs'],
    description: 'Linen thoáng, bản phối cổ điển, phù hợp du lịch.',
    category_slug: 'ao',
    price: 860000,
    quantity: 68,
    sold: 16,
    view: 130,
    rating: 4.6,
    colors: ['Beige','Trắng'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jogger 040',
    slug: 'quan-jogger-040',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Jogger phong cách, chất vải mềm, tiện vận động.',
    category_slug: 'quan',
    price: 540000,
    quantity: 120,
    sold: 40,
    view: 300,
    rating: 4.5,
    colors: ['Đen','Xám'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Chinos 041',
    slug: 'quan-chinos-041',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Chinos classic fit, đa dụng cho office & casual.',
    category_slug: 'quan',
    price: 720000,
    quantity: 82,
    sold: 35,
    view: 210,
    rating: 4.7,
    colors: ['Navy','Beige'],
    sizes: ['S','M','L','XL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Khoác Hoodie 042',
    slug: 'ao-khoac-hoodie-042',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Hoodie mềm mịn, túi trước tiện lợi, form thoải mái.',
    category_slug: 'ao-khoac',
    price: 740000,
    quantity: 100,
    sold: 38,
    view: 260,
    rating: 4.7,
    colors: ['Đen','Xám','Beige'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Short Linen 043',
    slug: 'quan-short-linen-043',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Short linen nhẹ, mát, phù hợp đi biển hoặc dạo phố.',
    category_slug: 'quan',
    price: 430000,
    quantity: 140,
    sold: 32,
    view: 200,
    rating: 4.4,
    colors: ['Beige','Navy'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Thun Polo 044',
    slug: 'ao-polo-044',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Polo basic, chất piqué thoáng mát, hợp office casual.',
    category_slug: 'ao',
    price: 560000,
    quantity: 130,
    sold: 34,
    view: 250,
    rating: 4.6,
    colors: ['Navy','Trắng','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Short Kaki 045',
    slug: 'quan-short-kaki-045',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'],
    description: 'Short kaki casual, tiện khi đi dạo & du lịch.',
    category_slug: 'quan',
    price: 360000,
    quantity: 160,
    sold: 45,
    view: 300,
    rating: 4.2,
    colors: ['Beige','Olive'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Len Dệt 046',
    slug: 'ao-len-det-046',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA'],
    description: 'Áo len dệt họa tiết, cozy cho mùa lạnh.',
    category_slug: 'ao',
    price: 750000,
    quantity: 60,
    sold: 18,
    view: 140,
    rating: 4.6,
    colors: ['Kem','Nâu','Xám'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Jeans Ống Suông 047',
    slug: 'quan-jeans-ong-suong-047',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Quần jeans ống suông, phong cách vintage đang hot.',
    category_slug: 'quan',
    price: 800000,
    quantity: 78,
    sold: 29,
    view: 215,
    rating: 4.6,
    colors: ['Indigo','Xanh nhạt'],
    sizes: ['28','30','32','34'],
    is_featured: true,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Polo Cotton 048',
    slug: 'ao-polo-cotton-048',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc'],
    description: 'Polo cotton lịch sự, chất liệu thoáng mát.',
    category_slug: 'ao',
    price: 550000,
    quantity: 150,
    sold: 45,
    view: 280,
    rating: 4.6,
    colors: ['Trắng','Navy','Xám'],
    sizes: ['S','M','L','XL','XXL'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Áo Sơ Mi Linen Caro 049',
    slug: 'ao-so-mi-linen-caro-049',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDbGSBBi5WNENPdxM45p08Sp6niq8pUeKmqIxT6KGdr1DAxDGk33lInZUZExYVTKhH0FSbMsCK_RpUIr7tnxblDBVxQwPMDqTpwYoF16f5gjCdKhlbMXwDxCLEpzAwjfSQrAlUV9AwmsL5wNAf_1HUgNVBIVY_lPJfHqeIUFwU0Lh0jc0mrfsVrV0rk1qizti1MW7uCd1ERyDJN8nbCQn9uwGWCqolFdH-BccGDhCdha--i-tXvirTHmO7En1eOJlwFOF_Cs7kwegs'],
    description: 'Linen caro nhẹ, phong cách mùa hè.',
    category_slug: 'ao',
    price: 870000,
    quantity: 60,
    sold: 8,
    view: 88,
    rating: 4.4,
    colors: ['Beige','Xanh rêu'],
    sizes: ['S','M','L'],
    is_featured: false,
    status: ProductStatus.Active
  },
  {
    name: 'Quần Kaki Slim 050',
    slug: 'quan-kaki-slim-050',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8'],
    description: 'Kaki slim fit, lịch sự và năng động.',
    category_slug: 'quan',
    price: 660000,
    quantity: 88,
    sold: 30,
    view: 210,
    rating: 4.6,
    colors: ['Beige','Đen'],
    sizes: ['S','M','L','XL'],
    is_featured: false,
    status: ProductStatus.Active
  }
]

/**
 * Banners Seed Data
 * Nguồn: ui/trangchu.html - Hero section
 */
const banners = [
  {
    title: 'Tinh thần tối giản\nVẻ đẹp bền vững',
    subtitle: 'Phong cách Thu Đông 2024',
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2SKUoOEQliT6zI5_2rUgEFrVSvWQPcD3cjHRFtCDzaVNMXWwVfV94R2o12djBf5mzW4zAzSdCQrMNSnhG1rSlVpMLjiYT_9oc5kLFYFhNPVHpACM-lezQ7UP6jbg_Ixpf6z9gL01Aym8plLHL4kz3dP-gYG_KGANfjTrffUpOZkcf0BabuyLegxJc7uc5Uxn_3xE88nhqgcf3D8gssYbmFxf5t24KiW7uAJlrMuURGJ24TSZpHTgs6j2s-bIZXfbiTq-gGNI1aVo',
    alt_text: 'Minimalist Japanese fashion model in autumn outfit walking in a serene park',
    cta_text: 'Khám Phá Ngay',
    cta_link: '/products',
    order: 1,
    position: 'home_hero',
    is_active: true
  }
]

/**
 * Users Seed Data
 * 
 * Admin User:
 *   - Email: admin@yori.com (hoặc từ env ADMIN_EMAIL)
 *   - Password: admin123 (hoặc từ env ADMIN_PASSWORD)
 *   - Role: Admin
 * 
 * Test Customer Users:
 *   - customer1@test.com / 123456
 *   - customer2@test.com / 123456
 *   - customer3@test.com / 123456
 */
const users = [
  {
    first_name: 'Admin',
    last_name: 'YORI',
    email: process.env.ADMIN_EMAIL || 'admin@yori.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: UserRole.Admin,
    verify: UserVerifyStatus.Verified
  },
  {
    first_name: 'Customer',
    last_name: 'Test 1',
    email: 'customer1@test.com',
    password: '123456',
    role: UserRole.Customer,
    verify: UserVerifyStatus.Verified
  },
  {
    first_name: 'Customer',
    last_name: 'Test 2',
    email: 'customer2@test.com',
    password: '123456',
    role: UserRole.Customer,
    verify: UserVerifyStatus.Verified
  },
  {
    first_name: 'Customer',
    last_name: 'Test 3',
    email: 'customer3@test.com',
    password: '123456',
    role: UserRole.Customer,
    verify: UserVerifyStatus.Verified
  }
]

async function seedCategories() {
  console.log('📦 Seeding categories...')
  const categoryCount = await databaseServices.categories.countDocuments()
  if (categoryCount === 0) {
    const categoryDocs = categories.map((cat) => new Category(cat))
    await databaseServices.categories.insertMany(categoryDocs)
    console.log('✅ Seed categories successfully!')
  } else {
    console.log('⏭️  Categories already exist. Skipping seed categories.')
  }
}

async function seedProducts() {
  console.log('📦 Seeding products...')
  const categoryDocs = await databaseServices.categories.find().toArray()
  
  // Get existing product slugs to avoid duplicates
  const existingProducts = await databaseServices.products.find({}, { projection: { slug: 1 } }).toArray()
  const existingSlugs = new Set(existingProducts.map((p) => p.slug))
  
  // Filter out products that already exist
  const newProducts = products.filter((prod) => !existingSlugs.has(prod.slug))
  
  if (newProducts.length === 0) {
    console.log('⏭️  All products already exist. Skipping seed products.')
    return
  }
  
  const productDocs = newProducts.map((prod) => {
    const category = categoryDocs.find((c) => c.slug === prod.category_slug)
    if (!category) {
      console.warn(`⚠️  Category "${prod.category_slug}" not found for product "${prod.name}". Skipping this product.`)
      return null
    }
    return new Product({
      ...prod,
      category: category._id as any
    })
  }).filter((p) => p !== null) as Product[]
  
  await databaseServices.products.insertMany(productDocs)
  console.log(`✅ Seed ${newProducts.length} new products successfully!`)

  // Create Text Index for Search (only if not exists)
  try {
    await databaseServices.products.createIndex({ name: 'text', description: 'text' })
    console.log('✅ Create text index for products successfully!')
  } catch (e: any) {
    if (!e.message?.includes('already exists')) {
      console.warn('⚠️  Text index creation warning:', e.message)
    }
  }
}

async function seedBanners() {
  console.log('📦 Seeding banners...')
  const bannerCount = await databaseServices.banners.countDocuments()
  if (bannerCount === 0) {
    const bannerDocs = banners.map((banner) => new Banner(banner))
    await databaseServices.banners.insertMany(bannerDocs)
    console.log('✅ Seed banners successfully!')
  } else {
    console.log('⏭️  Banners already exist. Skipping seed banners.')
  }
}

async function seedUsers() {
  console.log('📦 Seeding users...')
  for (const userData of users) {
    const existingUser = await databaseServices.users.findOne({ email: userData.email })
    if (!existingUser) {
      const user = new User({
        ...userData,
        password: hashPassword(userData.password)
      })
      await databaseServices.users.insertOne(user)
      console.log(`✅ Created user: ${userData.email}`)
    } else {
      console.log(`⏭️  User ${userData.email} already exists. Skipping.`)
    }
  }
  console.log('✅ Seed users successfully!')
}

async function seed() {
  try {
    console.log('🌱 Starting seed process...\n')

    // Validate seed data before connecting to database
    console.log('🔍 Validating seed data...')
    const validation = validateAllSeedData(categories, products)
    if (!validation.valid) {
      console.error('❌ Seed data validation failed:')
      validation.errors.forEach((error) => console.error(`   - ${error}`))
      process.exit(1)
    }
    console.log('✅ Seed data validation passed!\n')

    await databaseServices.connect()

    // Seed in order
    await seedCategories()
    await seedProducts()
    await seedBanners()
    await seedUsers()

    console.log('\n✅ All seed data completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run seed if executed directly
if (require.main === module) {
  seed()
}

export { seed, seedCategories, seedProducts, seedBanners, seedUsers }
