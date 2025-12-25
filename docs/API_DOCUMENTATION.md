# API Documentation

## Tổng quan

YORI Fashion API là RESTful API được xây dựng với Express.js và MongoDB. API hỗ trợ authentication, product management, cart, checkout, orders, và admin features.

## Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://yourdomain.com/api/v1`

## Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication. Có 2 loại tokens:

- **Access Token**: Hết hạn sau 15 phút (mặc định), được gửi trong header `Authorization: Bearer <token>`
- **Refresh Token**: Hết hạn sau 30 ngày (mặc định), được sử dụng để refresh access token

### Authentication Flow

1. **Register/Login**: Nhận `access_token` và `refresh_token`
2. **API Requests**: Gửi `access_token` trong header `Authorization: Bearer <token>`
3. **Token Expired**: Nếu access token hết hạn (401), tự động refresh bằng refresh token
4. **Refresh Token**: Gọi `/users/refresh-token` để lấy access token mới

## Response Format

### Success Response

Tất cả success responses có format:

```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

Tất cả error responses có format:

```json
{
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message for this field"
    }
  ]
}
```

### Pagination Format

Paginated responses có format:

```json
{
  "message": "Success message",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_page": 5,
      "total": 50
    }
  }
}
```

## HTTP Status Codes

- `200 OK` - Request thành công
- `201 Created` - Resource được tạo thành công
- `400 Bad Request` - Request không hợp lệ
- `401 Unauthorized` - Không có token hoặc token không hợp lệ
- `403 Forbidden` - Không có quyền truy cập
- `404 Not Found` - Resource không tồn tại
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

## Endpoints

### Authentication

#### POST `/users/register`
Đăng ký user mới.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Register success",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "user": { ... }
  }
}
```

#### POST `/users/login`
Đăng nhập.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login success",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "user": { ... }
  }
}
```

#### POST `/users/refresh-token`
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "..."
}
```

**Response:**
```json
{
  "message": "Refresh token success",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "user": { ... }
  }
}
```

#### POST `/users/logout`
Đăng xuất.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "message": "Logout success"
}
```

#### POST `/users/forgot-password`
Gửi email reset password.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Check your email for password reset link"
}
```

#### POST `/users/reset-password`
Reset password với token.

**Request Body:**
```json
{
  "forgot_password_token": "...",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Reset password success",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "user": { ... }
  }
}
```

### Products

#### GET `/products`
Lấy danh sách products.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category_slug` (optional): Filter by category
- `keyword` (optional): Search keyword
- `sort_by` (optional): Sort field (price, rating, created_at)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "message": "Get products success",
  "data": {
    "products": [...],
    "pagination": { ... }
  }
}
```

#### GET `/products/:slug`
Lấy product detail.

**Response:**
```json
{
  "message": "Get product success",
  "data": { ... }
}
```

#### GET `/products/:slug/related`
Lấy related products.

**Response:**
```json
{
  "message": "Get related products success",
  "data": [...]
}
```

### Categories

#### GET `/categories`
Lấy danh sách categories.

**Response:**
```json
{
  "message": "Get categories success",
  "data": [...]
}
```

### Banners

#### GET `/banners`
Lấy danh sách banners.

**Query Parameters:**
- `position` (optional): Filter by position (e.g., `home_hero`)

**Response:**
```json
{
  "message": "Get banners success",
  "data": [...]
}
```

### Cart

#### GET `/cart`
Lấy cart của user.

**Headers:** `Authorization: Bearer <access_token>`

**Response:**
```json
{
  "message": "Get cart success",
  "data": {
    "_id": "...",
    "user_id": "...",
    "items": [...]
  }
}
```

#### POST `/cart/items`
Thêm item vào cart.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "product_id": "...",
  "buy_count": 1,
  "color": "White",
  "size": "M"
}
```

**Response:**
```json
{
  "message": "Add to cart success",
  "data": { ... }
}
```

#### PUT `/cart/items/:item_id`
Cập nhật quantity của item.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "buy_count": 2
}
```

#### DELETE `/cart/items/:item_id`
Xóa item khỏi cart.

**Headers:** `Authorization: Bearer <access_token>`

### Checkout

#### GET `/checkout/init`
Khởi tạo checkout (lấy user info và saved addresses).

**Headers:** `Authorization: Bearer <access_token>`

#### POST `/checkout/validate-shipping`
Validate shipping address và tính shipping fee.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "receiver_name": "John Doe",
  "phone": "0123456789",
  "email": "john@example.com",
  "address": "123 Main St",
  "province_id": "...",
  "district_id": "...",
  "ward_id": "..."
}
```

#### GET `/checkout/payment-info`
Lấy payment summary.

**Headers:** `Authorization: Bearer <access_token>`

#### POST `/checkout/place-order`
Đặt hàng.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "payment_method": "cod",
  "note": "Optional note",
  "shipping_address": "123 Main St",
  "receiver_name": "John Doe",
  "phone": "0123456789",
  "email": "john@example.com"
}
```

### Orders

#### GET `/orders`
Lấy danh sách orders của user.

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (optional)
- `limit` (optional)
- `status` (optional)

#### GET `/orders/:order_id`
Lấy order detail.

**Headers:** `Authorization: Bearer <access_token>`

### Contact

#### POST `/contact/submit`
Gửi contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "subject": "Question",
  "message": "Your message here"
}
```

### Admin Endpoints

Tất cả admin endpoints yêu cầu:
- `Authorization: Bearer <access_token>`
- User có role `admin` hoặc `staff`

#### GET `/admin/dashboard/stats`
Dashboard statistics.

#### GET `/admin/products`
Lấy danh sách products (admin).

#### GET `/admin/orders`
Lấy danh sách orders (admin).

#### GET `/admin/customers`
Lấy danh sách customers (admin).

Xem chi tiết trong OpenAPI specs: `be/src/docs/openapi/`

## Error Codes và Messages

### Authentication Errors

- `401 Unauthorized`: Token không hợp lệ hoặc đã hết hạn
- `403 Forbidden`: Không có quyền truy cập (admin only)

### Validation Errors

- `422 Unprocessable Entity`: Validation errors với chi tiết trong `errors` array

### Common Error Messages

- `User not found`
- `Product not found`
- `Category not found`
- `Invalid credentials`
- `Email already exists`
- `Token expired`
- `Access denied`

## OpenAPI/Swagger Documentation

OpenAPI specifications được lưu trong `be/src/docs/openapi/`:

- `base.json` - Base configuration
- `auth.json` - Authentication endpoints
- `products.json` - Product endpoints
- `cart.json` - Cart endpoints
- `checkout.json` - Checkout endpoints
- `orders.user.json` - User order endpoints
- `admin.*.json` - Admin endpoints

Có thể sử dụng Swagger UI hoặc Postman để import và test API.

## Rate Limiting

Hiện tại chưa có rate limiting. Nên implement trong production.

## CORS

CORS được cấu hình để chỉ cho phép requests từ `FRONTEND_URL` (mặc định: `http://localhost:5173`).

## Notes

- Tất cả timestamps sử dụng ISO 8601 format
- Prices được lưu dưới dạng số (VND, không có decimal)
- Images URLs phải là absolute URLs
- Pagination mặc định: page=1, limit=10

