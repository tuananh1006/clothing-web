# Seed Data Documentation

## Tổng quan

Script seed data được sử dụng để khởi tạo dữ liệu ban đầu cho database, bao gồm:
- Categories (Danh mục sản phẩm)
- Products (Sản phẩm)
- Banners (Banner quảng cáo)
- Users (Người dùng: Admin và Test users)

## Nguồn dữ liệu

Tất cả seed data được lấy từ UI files:
- `ui/trangchu.html` - Trang chủ với featured products, best sellers, hero banner
- `ui/categories.html` - Trang danh mục với category listings
- `ui/product.html` - Trang sản phẩm với product details

## Cách chạy Seed Script

### Cách 1: Sử dụng npm script (Khuyến nghị)

```bash
cd be
npm run db:seed
```

### Cách 2: Chạy trực tiếp với ts-node

```bash
cd be
npx ts-node -r tsconfig-paths/register src/utils/seed.ts
```

### Cách 3: Từ root directory

```bash
cd be && npm run db:seed
```

## Hành vi của Script

- **Categories**: Chỉ seed nếu collection rỗng (không xóa data cũ)
- **Products**: Chỉ seed nếu collection rỗng (không xóa data cũ)
- **Banners**: Chỉ seed nếu collection rỗng (không xóa data cũ)
- **Users**: Chỉ tạo user nếu email chưa tồn tại (không tạo duplicate)

## Default Credentials

### Admin User

- **Email**: `admin@yori.com` (có thể override bằng env `ADMIN_EMAIL`)
- **Password**: `admin123` (có thể override bằng env `ADMIN_PASSWORD`)
- **Role**: `admin`
- **Status**: `verified`

### Test Customer Users

1. **Customer 1**
   - Email: `customer1@test.com`
   - Password: `123456`
   - Role: `customer`
   - Status: `verified`

2. **Customer 2**
   - Email: `customer2@test.com`
   - Password: `123456`
   - Role: `customer`
   - Status: `verified`

3. **Customer 3**
   - Email: `customer3@test.com`
   - Password: `123456`
   - Role: `customer`
   - Status: `verified`

## Seed Data Validation

Script tự động validate seed data trước khi seed vào database:

- ✅ Tất cả products phải có category hợp lệ
- ✅ Tất cả slugs phải unique và URL-friendly (lowercase, alphanumeric, hyphens only)
- ✅ Prices phải là số dương
- ✅ Image URLs phải có format hợp lệ (http/https)
- ✅ Colors và sizes arrays không được empty
- ✅ Ratings phải trong khoảng 0-5

Nếu validation fail, script sẽ dừng và hiển thị lỗi chi tiết.

## Seed Data Details

### Categories (6 categories)

1. **Áo** - Featured
2. **Quần** - Featured
3. **Áo khoác** - Featured
4. **Đồ Len & Dệt Kim**
5. **Denim Tối Giản**
6. **Phụ Kiện**

### Products (11 products)

1. Áo sơ mi Linen (850.000đ) - Featured
2. Quần ống rộng Taki (650.000đ)
3. Váy suông Sumi (790.000đ)
4. Áo thun Cotton Basic (350.000đ)
5. Áo khoác Blazer Kaki (950.000đ) - Featured
6. Sơ mi lụa Muji (720.000đ) - Featured
7. Túi Canvas YORI (250.000đ) - Featured
8. Quần Tây Chinos (680.000đ) - Featured
9. Oversized Tee (450.000đ)
10. Casual Shorts (380.000đ)
11. Denim Jacket (890.000đ)

### Banners (1 banner)

- **Hero Banner**: "Tinh thần tối giản\nVẻ đẹp bền vững"
  - Subtitle: "Phong cách Thu Đông 2024"
  - CTA: "Khám Phá Ngay" → `/products`
  - Position: `home_hero`

## Troubleshooting

### Lỗi: "Cannot find module '~/services/database.services'"

**Giải pháp**: Sử dụng `npm run db:seed` thay vì chạy trực tiếp `ts-node`. Script này đã được cấu hình với `tsconfig-paths/register` để resolve path aliases.

### Lỗi: "Categories already exist"

**Giải pháp**: Đây không phải lỗi. Script sẽ skip seed nếu data đã tồn tại. Nếu muốn seed lại, cần xóa data trong database trước.

### Lỗi: "User already exists"

**Giải pháp**: Script sẽ skip user nếu email đã tồn tại. Nếu muốn tạo lại user, cần xóa user trong database trước.

## Environment Variables

Có thể override admin credentials bằng environment variables:

```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-password
```

## Notes

- Script sử dụng relative imports để tương thích với `ts-node`
- Tất cả passwords được hash bằng bcrypt trước khi lưu vào database
- Text index được tạo tự động cho products (name, description) để hỗ trợ search

