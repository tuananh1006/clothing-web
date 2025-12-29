# Environment Variables Documentation

## Tổng quan

File này document tất cả environment variables được sử dụng trong backend application. Tạo file `.env` trong thư mục `be/` và copy từ `.env.example`, sau đó điền các giá trị phù hợp.

## Server Configuration

### `PORT`
- **Type**: Number
- **Default**: `5000`
- **Description**: Port mà server sẽ lắng nghe
- **Example**: `5000`

### `FRONTEND_URL`
- **Type**: String (URL)
- **Default**: `http://localhost:5173`
- **Description**: URL của frontend application, được sử dụng cho CORS configuration
- **Example**: `http://localhost:5173` hoặc `https://yourdomain.com`

## Database Configuration

### `DB_USERNAME`
- **Type**: String
- **Required**: Yes
- **Description**: MongoDB username
- **Example**: `your_mongodb_username`

### `DB_PASSWORD`
- **Type**: String
- **Required**: Yes
- **Description**: MongoDB password
- **Example**: `your_mongodb_password`

### `DB_NAME`
- **Type**: String
- **Default**: `test`
- **Description**: Tên database MongoDB
- **Example**: `test`, `yori_production`

### Database Collections

Các biến sau là optional, nếu không set sẽ dùng default values:

- `DB_USERS_COLLECTION` (default: `users`)
- `DB_REFRESH_TOKENS_COLLECTION` (default: `refresh_tokens`)
- `DB_CATEGORIES_COLLECTION` (default: `categories`)
- `DB_PRODUCTS_COLLECTION` (default: `products`)
- `DB_CARTS_COLLECTION` (default: `carts`)
- `DB_ORDERS_COLLECTION` (default: `orders`)
- `DB_REVIEWS_COLLECTION` (default: `reviews`)
- `DB_SETTINGS_COLLECTION` (default: `settings`)
- `DB_CONTACTS_COLLECTION` (default: `contacts`)
- `DB_BANNERS_COLLECTION` (default: `banners`)

## JWT Configuration

### `JWT_SECRET`
- **Type**: String
- **Required**: Yes
- **Description**: Secret key để sign và verify JWT tokens
- **Security**: Nên sử dụng strong random string, ít nhất 32 characters
- **Example**: `your_super_secret_jwt_key_here_min_32_chars`

### `ACCESS_TOKEN_EXPIRE_IN`
- **Type**: String (time format)
- **Default**: `15m` (khuyến nghị: `1h` hoặc `24h` cho production)
- **Description**: Thời gian hết hạn của access token
- **Format**: Sử dụng format của `ms` package (e.g., `15m`, `1h`, `7d`)
- **Example**: `15m`, `1h`, `24h`
- **Note**: 
  - Frontend sẽ tự động refresh token trước khi hết hạn (5 phút trước)
  - Nếu để `15m`, token sẽ được refresh sau 10 phút
  - Khuyến nghị: `1h` (1 giờ) hoặc `24h` (1 ngày) để giảm số lần refresh

### `REFRESH_TOKEN_EXPIRE_IN`
- **Type**: String (time format)
- **Default**: `7d` (khuyến nghị: `30d` hoặc `90d` cho production)
- **Description**: Thời gian hết hạn của refresh token
- **Format**: Sử dụng format của `ms` package
- **Example**: `7d`, `30d`, `60d`, `90d`
- **Note**: 
  - Refresh token có thời gian dài hơn access token
  - Khi refresh token hết hạn, user phải đăng nhập lại
  - Khuyến nghị: `30d` (30 ngày) hoặc `90d` (90 ngày) cho production

### `FORGOT_PASSWORD_TOKEN_EXPIRE_IN`
- **Type**: String (time format)
- **Default**: `5m`
- **Description**: Thời gian hết hạn của forgot password token
- **Format**: Sử dụng format của `ms` package
- **Example**: `5m`, `10m`, `15m`

## SMTP Configuration (Optional)

Các biến này chỉ cần thiết nếu bạn muốn gửi email (forgot password, contact notifications, etc.).

### `SMTP_HOST`
- **Type**: String
- **Required**: No (chỉ cần nếu muốn gửi email)
- **Description**: SMTP server host
- **Example**: `smtp.gmail.com`, `smtp.mailtrap.io`

### `SMTP_PORT`
- **Type**: Number
- **Default**: `587`
- **Description**: SMTP server port
- **Example**: `587` (TLS), `465` (SSL), `25` (unencrypted)

### `SMTP_USER`
- **Type**: String (email)
- **Required**: No (chỉ cần nếu muốn gửi email)
- **Description**: SMTP username (thường là email address)
- **Example**: `your_email@gmail.com`

### `SMTP_PASS`
- **Type**: String
- **Required**: No (chỉ cần nếu muốn gửi email)
- **Description**: SMTP password hoặc app-specific password
- **Example**: `your_email_password` hoặc `app_specific_password`

### `SMTP_FROM_NAME`
- **Type**: String
- **Default**: `YORI Fashion`
- **Description**: Tên hiển thị trong email sender
- **Example**: `YORI Fashion`

### `SMTP_FROM_EMAIL`
- **Type**: String (email)
- **Default**: `SMTP_USER`
- **Description**: Email address hiển thị trong email sender
- **Example**: `noreply@yori.com`

**Lưu ý**: Nếu không set các SMTP variables, email sending sẽ bị skip (không gây lỗi).

## Cloudinary Configuration (Optional - for Image Uploads)

### `CLOUDINARY_URL`
- **Type**: String (URL)
- **Required**: No (chỉ cần nếu muốn upload ảnh lên Cloudinary)
- **Description**: Cloudinary connection URL với format `cloudinary://api_key:api_secret@cloud_name`
- **Example**: `cloudinary://654923212411218:your_api_secret@dxlipiz59`

**Hoặc sử dụng các biến riêng lẻ:**

### `CLOUDINARY_CLOUD_NAME`
- **Type**: String
- **Required**: No
- **Description**: Cloudinary cloud name
- **Example**: `dxlipiz59`

### `CLOUDINARY_API_KEY`
- **Type**: String
- **Required**: No
- **Description**: Cloudinary API key
- **Example**: `654923212411218`

### `CLOUDINARY_API_SECRET`
- **Type**: String
- **Required**: No
- **Description**: Cloudinary API secret
- **Example**: `your_api_secret`

**Lưu ý**: 
- Nếu không set Cloudinary variables, image uploads sẽ fail
- Ưu tiên sử dụng `CLOUDINARY_URL` vì đơn giản hơn
- Cloudinary được sử dụng để upload ảnh reviews

## Password Hashing

### `PASSWORD_SERCRET`
- **Type**: String
- **Required**: Yes
- **Description**: Secret key để hash passwords (sử dụng SHA256)
- **Security**: Nên sử dụng strong random string
- **Example**: `your_password_secret_key_here`

## API Configuration

### `API_URL`
- **Type**: String (URL)
- **Default**: `http://localhost:5000/api/v1`
- **Description**: Base URL của API (sử dụng trong test scripts)
- **Example**: `http://localhost:5000/api/v1`

## Admin User (for Seed Script)

### `ADMIN_EMAIL`
- **Type**: String (email)
- **Default**: `admin@yori.com`
- **Description**: Email của admin user được tạo bởi seed script
- **Example**: `admin@yori.com`

### `ADMIN_PASSWORD`
- **Type**: String
- **Default**: `admin123`
- **Description**: Password của admin user được tạo bởi seed script
- **Security**: Nên đổi password sau khi seed
- **Example**: `admin123`

## Setup Instructions

1. Copy `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Điền các giá trị cần thiết vào `.env`:
   - Database credentials (DB_USERNAME, DB_PASSWORD, DB_NAME)
   - JWT_SECRET (generate một random string)
   - SMTP config (nếu muốn gửi email)
   - Admin credentials (nếu muốn override defaults)

3. **Quan trọng**: Không commit file `.env` vào git! File `.env` đã được thêm vào `.gitignore`.

## Security Best Practices

1. **JWT_SECRET**: Sử dụng strong random string, ít nhất 32 characters. Có thể generate bằng:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Database Password**: Sử dụng strong password cho MongoDB

3. **SMTP Password**: 
   - Với Gmail: sử dụng App Password thay vì account password
   - Không commit SMTP credentials vào git

4. **Environment Variables**: 
   - Không hardcode sensitive values trong code
   - Sử dụng environment variables cho tất cả sensitive data
   - Sử dụng `.env.example` để document required variables

## Production Considerations

Khi deploy lên production:

1. Sử dụng environment variables từ hosting platform (Vercel, Heroku, AWS, etc.)
2. Không sử dụng `.env` file trong production
3. Set `FRONTEND_URL` thành production URL
4. Sử dụng strong JWT_SECRET
5. Sử dụng production database credentials
6. Configure SMTP với production email service

## Troubleshooting

### Database Connection Error
- Kiểm tra `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` đã đúng chưa
- Kiểm tra MongoDB connection string format
- Kiểm tra network/firewall settings

### JWT Token Errors
- Kiểm tra `JWT_SECRET` đã được set
- Đảm bảo `JWT_SECRET` đủ mạnh (ít nhất 32 characters)

### Email Not Sending
- Kiểm tra SMTP variables đã được set đầy đủ
- Với Gmail: cần sử dụng App Password, không phải account password
- Kiểm tra SMTP_HOST và SMTP_PORT đúng chưa
- Nếu không cần email, có thể bỏ qua SMTP config (sẽ không gây lỗi)

