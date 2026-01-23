/**
 * Seed Coupons Data Script
 * 
 * Cách chạy:
 *   - Từ thư mục be: npm run db:seed:coupons
 *   - Hoặc: npx ts-node -r tsconfig-paths/register src/utils/seed-coupons.ts
 * 
 * Lưu ý:
 *   - Script sẽ chỉ seed data nếu chưa tồn tại (không xóa data cũ)
 *   - Chỉ tạo coupon nếu code chưa tồn tại
 */

import databaseServices from '../services/database.services'
import Coupon, { DiscountType, ApplicableTo } from '../models/schemas/Coupon.schema'
import { config } from 'dotenv'

config()

/**
 * Coupons Seed Data
 * Các mã giảm giá mẫu với nhiều loại khác nhau
 */
const coupons = [
  {
    code: 'WELCOME10',
    name: 'Chào mừng khách hàng mới',
    description: 'Giảm 10% cho đơn hàng đầu tiên',
    discount_type: DiscountType.Percentage,
    discount_value: 10,
    min_order_value: 0,
    max_discount: 50000,
    usage_limit: 1,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 năm
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'SALE2024',
    name: 'Khuyến mãi năm mới 2024',
    description: 'Giảm 20% cho tất cả sản phẩm',
    discount_type: DiscountType.Percentage,
    discount_value: 20,
    min_order_value: 200000,
    max_discount: 100000,
    usage_limit: 0, // Không giới hạn
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 ngày
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'FREESHIP',
    name: 'Miễn phí vận chuyển',
    description: 'Giảm 30,000đ phí vận chuyển',
    discount_type: DiscountType.FixedAmount,
    discount_value: 30000,
    min_order_value: 500000,
    max_discount: 0,
    usage_limit: 0,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 ngày
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'VIP50',
    name: 'Mã VIP',
    description: 'Giảm 50,000đ cho khách hàng VIP',
    discount_type: DiscountType.FixedAmount,
    discount_value: 50000,
    min_order_value: 300000,
    max_discount: 0,
    usage_limit: 5,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 ngày
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'FLASH15',
    name: 'Flash Sale',
    description: 'Giảm 15% cho đơn hàng trên 500,000đ',
    discount_type: DiscountType.Percentage,
    discount_value: 15,
    min_order_value: 500000,
    max_discount: 150000,
    usage_limit: 0,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'NEWUSER',
    name: 'Khách hàng mới',
    description: 'Giảm 25,000đ cho khách hàng mới',
    discount_type: DiscountType.FixedAmount,
    discount_value: 25000,
    min_order_value: 100000,
    max_discount: 0,
    usage_limit: 1,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 năm
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'BIGSALE',
    name: 'Đại hạ giá',
    description: 'Giảm 30% cho đơn hàng trên 1,000,000đ',
    discount_type: DiscountType.Percentage,
    discount_value: 30,
    min_order_value: 1000000,
    max_discount: 300000,
    usage_limit: 0,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 ngày
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'SALE2026',
    name: 'Giảm giá năm mới',
    description: 'Giảm 50% cho đơn hàng trên 500,000đ',
    discount_type: DiscountType.Percentage,
    discount_value: 50,
    min_order_value: 500000,
    max_discount: 100000,
    usage_limit: 44,
    valid_from: new Date('2026-01-01'),
    valid_until: new Date('2026-01-31'),
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'EXPIRED',
    name: 'Mã đã hết hạn (test)',
    description: 'Mã giảm giá đã hết hạn để test',
    discount_type: DiscountType.Percentage,
    discount_value: 10,
    min_order_value: 0,
    max_discount: 0,
    usage_limit: 0,
    valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 ngày trước
    valid_until: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
    is_active: true,
    applicable_to: ApplicableTo.All
  },
  {
    code: 'INACTIVE',
    name: 'Mã đã tắt (test)',
    description: 'Mã giảm giá đã bị tắt để test',
    discount_type: DiscountType.Percentage,
    discount_value: 10,
    min_order_value: 0,
    max_discount: 0,
    usage_limit: 0,
    valid_from: new Date(),
    valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 năm
    is_active: false,
    applicable_to: ApplicableTo.All
  }
]

async function seedCoupons() {
  try {
    console.log('🌱 Starting coupon seed process...\n')

    await databaseServices.connect()

    console.log('📦 Seeding coupons...')
    const couponCount = await databaseServices.coupons.countDocuments()
    
    if (couponCount === 0) {
      const couponDocs = coupons.map((coupon) => new Coupon(coupon))
      await databaseServices.coupons.insertMany(couponDocs)
      console.log(`✅ Seed ${coupons.length} coupons successfully!`)
    } else {
      // Check which coupons don't exist yet
      const existingCoupons = await databaseServices.coupons.find({}, { projection: { code: 1 } }).toArray()
      const existingCodes = new Set(existingCoupons.map((c) => c.code))
      const newCoupons = coupons.filter((c) => !existingCodes.has(c.code.toUpperCase()))
      
      if (newCoupons.length > 0) {
        const couponDocs = newCoupons.map((coupon) => new Coupon(coupon))
        await databaseServices.coupons.insertMany(couponDocs)
        console.log(`✅ Seed ${newCoupons.length} new coupons successfully!`)
      } else {
        console.log('⏭️  All coupons already exist. Skipping seed coupons.')
      }
    }

    console.log('\n✅ Coupon seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Coupon seed failed:', error)
    process.exit(1)
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedCoupons()
}

export default seedCoupons

