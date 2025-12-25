# API Testing Checklist

## Phase 11: Testing & Verification

### Step 1: API Endpoint Testing

#### Auth Endpoints
- [ ] **POST /api/v1/users/register**
  - [ ] Test với valid data → 201 Created
  - [ ] Test với missing required fields → 422 Validation Error
  - [ ] Test với duplicate email → 422 Validation Error
  - [ ] Verify response: `{ message, data: { access_token, refresh_token, user } }`

- [ ] **POST /api/v1/users/login**
  - [ ] Test với valid credentials → 200 OK
  - [ ] Test với invalid credentials → 401 Unauthorized
  - [ ] Verify response: `{ message, data: { access_token, refresh_token, user } }`

- [ ] **POST /api/v1/users/refresh-token**
  - [ ] Test với valid refresh_token → 200 OK
  - [ ] Test với invalid refresh_token → 401 Unauthorized
  - [ ] Verify response: `{ message, data: { access_token, refresh_token, user } }`

- [ ] **POST /api/v1/users/logout**
  - [ ] Test với valid access_token → 200 OK
  - [ ] Test với invalid access_token → 401 Unauthorized
  - [ ] Verify response: `{ message }`

- [ ] **POST /api/v1/users/forgot-password**
  - [ ] Test với valid email → 200 OK
  - [ ] Test với invalid email → 422 Validation Error
  - [ ] Verify response: `{ message }`

- [ ] **POST /api/v1/users/reset-password**
  - [ ] Test với valid token → 200 OK
  - [ ] Test với invalid token → 401 Unauthorized
  - [ ] Verify response: `{ message, data: { access_token, refresh_token, user } }`

#### User Endpoints
- [ ] **GET /api/v1/users/me**
  - [ ] Test với valid access_token → 200 OK
  - [ ] Test without token → 401 Unauthorized
  - [ ] Verify response: `{ message, data: User }`

- [ ] **PATCH /api/v1/users/me**
  - [ ] Test với valid data → 200 OK
  - [ ] Test với invalid email → 422 Validation Error
  - [ ] Verify response: `{ message, data: User }`

- [ ] **POST /api/v1/users/me/avatar**
  - [ ] Test với avatar_url → 200 OK
  - [ ] Test without token → 401 Unauthorized
  - [ ] Verify response: `{ message, data: { avatar_url } }`

#### Products Endpoints
- [ ] **GET /api/v1/products**
  - [ ] Test với query params (page, limit, category_slug, etc.) → 200 OK
  - [ ] Verify response: `{ message, data: { products: [], pagination: { page, limit, total_page, total } } }`

- [ ] **GET /api/v1/products/:slug**
  - [ ] Test với valid slug → 200 OK
  - [ ] Test với invalid slug → 404 Not Found
  - [ ] Verify response: `{ message, data: Product }`

- [ ] **GET /api/v1/products/:slug/related**
  - [ ] Test với valid slug → 200 OK
  - [ ] Verify response: `{ message, data: Product[] }`

#### Cart Endpoints
- [ ] **GET /api/v1/cart**
  - [ ] Test với valid access_token → 200 OK
  - [ ] Verify response: `{ message, data: { _id, user_id, items: [] } }`

- [ ] **POST /api/v1/cart/items**
  - [ ] Test với valid product_id → 200 OK
  - [ ] Test với invalid product_id → 422 Validation Error
  - [ ] Verify response: `{ message, data: Cart }`

- [ ] **PUT /api/v1/cart/items/:item_id**
  - [ ] Test với valid buy_count → 200 OK
  - [ ] Verify response: `{ message, data: Cart }`

- [ ] **DELETE /api/v1/cart/items/:item_id**
  - [ ] Test với valid item_id → 200 OK
  - [ ] Verify response: `{ message, data: Cart }`

#### Checkout Endpoints
- [ ] **GET /api/v1/checkout/init**
  - [ ] Test với valid access_token → 200 OK
  - [ ] Verify response: `{ message, data: { user, saved_addresses } }`

- [ ] **POST /api/v1/checkout/validate-shipping**
  - [ ] Test với valid shipping info → 200 OK
  - [ ] Test với missing required fields → 422 Validation Error
  - [ ] Verify response: `{ message, data: { shipping_fee, shipping_methods } }`

- [ ] **GET /api/v1/checkout/payment-info**
  - [ ] Test với valid access_token → 200 OK
  - [ ] Verify response: `{ message, data: { summary, payment_methods } }`

- [ ] **POST /api/v1/checkout/place-order**
  - [ ] Test với valid order data → 200 OK
  - [ ] Test với empty cart → 400 Bad Request
  - [ ] Verify response: `{ message, data: { order_id, order_code } }`

#### Orders Endpoints
- [ ] **GET /api/v1/orders**
  - [ ] Test với query params (page, limit, status, etc.) → 200 OK
  - [ ] Verify response: `{ message, data: { items: [], pagination: { page, limit, total_page, total } } }`

- [ ] **GET /api/v1/orders/:order_id**
  - [ ] Test với valid order_id → 200 OK
  - [ ] Test với invalid order_id → 404 Not Found
  - [ ] Verify response: `{ message, data: Order }`

#### Admin Endpoints
- [ ] **GET /api/v1/admin/dashboard/stats**
  - [ ] Test với admin access_token → 200 OK
  - [ ] Test với customer token → 403 Forbidden
  - [ ] Verify response: `{ message, data: { total_revenue, total_orders, total_customers, total_products } }`

- [ ] **GET /api/v1/admin/products**
  - [ ] Test với query params → 200 OK
  - [ ] Verify response: `{ message, data: { products: [], pagination } }`

- [ ] **GET /api/v1/admin/orders**
  - [ ] Test với query params → 200 OK
  - [ ] Verify response: `{ message, data: { orders: [], pagination } }`

- [ ] **GET /api/v1/admin/customers**
  - [ ] Test với query params → 200 OK
  - [ ] Verify response: `{ message, data: { customers: [], pagination } }`

#### Contact Endpoint
- [ ] **POST /api/v1/contact/submit**
  - [ ] Test với valid data → 200 OK
  - [ ] Test với missing required fields → 422 Validation Error
  - [ ] Verify response: `{ message, data: { id, name, email, created_at } }`

### Step 2: Response Format Verification

#### Success Responses
- [ ] Tất cả success responses có format: `{ message: string, data: any }`
- [ ] HTTP status codes đúng:
  - [ ] 200 OK cho GET, PUT, PATCH, DELETE
  - [ ] 201 Created cho POST (register)
  - [ ] 200 OK cho POST (login, logout, etc.)

#### Error Responses
- [ ] Tất cả error responses có format: `{ message: string, errors?: Array<{ field: string, message: string }> }`
- [ ] HTTP status codes đúng:
  - [ ] 400 Bad Request
  - [ ] 401 Unauthorized
  - [ ] 403 Forbidden
  - [ ] 404 Not Found
  - [ ] 422 Unprocessable Entity (validation errors)
  - [ ] 500 Internal Server Error

#### Pagination Format
- [ ] Tất cả paginated responses có format: `{ page: number, limit: number, total_page: number, total: number }`
- [ ] Verify trong: products, orders, admin/products, admin/orders, admin/customers

#### Data Types
- [ ] Strings: `_id`, `name`, `email`, `slug`, etc.
- [ ] Numbers: `price`, `quantity`, `rating`, etc.
- [ ] Booleans: `is_featured`, `billing_address_same_as_shipping`, etc.
- [ ] Arrays: `items`, `products`, `colors`, `sizes`, etc.
- [ ] Objects: `user`, `category`, `shipping_info`, `cost_summary`, etc.

### Step 3: Frontend Integration Testing

#### Login/Register Flow
- [ ] User có thể register thành công
- [ ] User có thể login với email/password
- [ ] User được redirect sau khi login
- [ ] Tokens được lưu vào localStorage
- [ ] User có thể logout

#### Product Listing và Detail
- [ ] Products list hiển thị đúng
- [ ] Pagination hoạt động
- [ ] Filter by category hoạt động
- [ ] Product detail page hiển thị đầy đủ thông tin
- [ ] Related products hiển thị

#### Add to Cart
- [ ] User có thể add product to cart
- [ ] Cart count update đúng
- [ ] Cart page hiển thị items đúng
- [ ] User có thể update quantity
- [ ] User có thể remove items

#### Checkout Flow
- [ ] Checkout init load user info
- [ ] Shipping validation hoạt động
- [ ] Payment info tính toán đúng
- [ ] User có thể place order
- [ ] Order được tạo thành công

#### Order History
- [ ] Orders list hiển thị đúng
- [ ] Order detail hiển thị đầy đủ thông tin
- [ ] Status badges hiển thị đúng

#### Admin Dashboard
- [ ] Admin có thể access dashboard
- [ ] Stats hiển thị đúng
- [ ] Charts render đúng
- [ ] Products management hoạt động
- [ ] Orders management hoạt động
- [ ] Customers management hoạt động

---

## Testing Tools

### Recommended Tools
- **Postman** - API testing
- **Thunder Client** (VS Code extension) - API testing
- **Browser DevTools** - Network tab để verify requests/responses
- **MongoDB Compass** - Verify database data

### Test Data
- Admin user: `admin@yori.com` / `admin123`
- Test customers: `customer1@test.com` / `123456`

---

*Last Updated: [Date]*

