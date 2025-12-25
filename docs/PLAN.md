# Kế Hoạch Phát Triển Frontend React - YORI Fashion

Tài liệu này phác thảo lộ trình phát triển Frontend React dựa trên UI HTML hiện có và tích hợp với Backend API.

## 📋 Tổng Quan Dự Án

### Mục Tiêu
- Build Frontend React hoàn chỉnh từ các file HTML trong thư mục `ui/`
- Tích hợp với Backend API đã có sẵn
- Đảm bảo UX/UI nhất quán với thiết kế hiện tại
- Hỗ trợ Dark Mode
- Responsive design

### Tech Stack
- **Framework**: React 18+ với TypeScript
- **Routing**: React Router v6
- **State Management**: React Context API + Custom Hooks (hoặc Zustand nếu cần)
- **Styling**: TailwindCSS (giữ nguyên config từ HTML)
- **HTTP Client**: Axios hoặc Fetch API
- **Form Handling**: React Hook Form
- **Build Tool**: Vite
- **Icons**: Material Symbols (giữ nguyên từ HTML)

---

## 🗂️ Cấu Trúc Dự Án Frontend

```
frontend/
├── public/
│   └── assets/          # Images, fonts, static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Header, Footer, Button, Input, etc.
│   │   ├── product/     # ProductCard, ProductList, ProductDetail
│   │   ├── cart/        # CartItem, CartSummary
│   │   ├── checkout/    # CheckoutForm, ShippingForm, PaymentForm
│   │   └── admin/       # Admin components
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   ├── Profile.tsx
│   │   └── admin/       # Admin pages
│   ├── hooks/           # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── useApi.ts
│   ├── services/        # API services
│   │   ├── api.ts       # Axios instance & interceptors
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── cart.service.ts
│   │   ├── orders.service.ts
│   │   └── admin.service.ts
│   ├── contexts/        # React Context
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── types/           # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── cart.types.ts
│   │   └── order.types.ts
│   ├── utils/           # Utility functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx       # Route definitions
└── package.json
```

---

## 📄 Mapping UI HTML → React Components

### Public Pages (Không cần auth)
| HTML File | React Component | Route | API Endpoints |
|-----------|----------------|-------|---------------|
| `trangchu.html` | `Home.tsx` | `/` | `GET /api/v1/banners`, `GET /api/v1/products?is_featured=true` |
| `login.html` | `Login.tsx` | `/login` | `POST /api/v1/auth/login`, `POST /api/v1/auth/social-login` |
| `signup.html` | `Signup.tsx` | `/signup` | `POST /api/v1/auth/register` |
| `forgotpw.html` | `ForgotPassword.tsx` | `/forgot-password` | `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password` |
| `product.html` | `Products.tsx` | `/products` | `GET /api/v1/products`, `GET /api/v1/categories` |
| `product_info.html` | `ProductDetail.tsx` | `/products/:slug` | `GET /api/v1/products/:slug`, `GET /api/v1/products/:slug/related` |
| `categories.html` | `Categories.tsx` | `/categories` | `GET /api/v1/categories` |
| `search.html` | `Search.tsx` | `/search` | `GET /api/v1/products?name=...` |
| `choose_size.html` | `SizeGuide.tsx` | `/size-guide` | Static page (có thể thêm `GET /api/v1/size-charts` sau) |
| `introduction.html` | `About.tsx` | `/about` | Static page |
| `contract.html` | `Contact.tsx` | `/contact` | `POST /api/v1/contact/submit` |
| `term_policies.html` | `Terms.tsx` | `/terms` | Static page |
| `404.html` | `NotFound.tsx` | `*` | - |

### Protected Pages (Cần auth)
| HTML File | React Component | Route | API Endpoints |
|-----------|----------------|-------|---------------|
| `cart.html` | `Cart.tsx` | `/cart` | `GET /api/v1/cart`, `PUT /api/v1/cart/items/:id`, `DELETE /api/v1/cart/items/:id` |
| `ship.html` | `Checkout.tsx` | `/checkout` | `GET /api/v1/checkout/init`, `POST /api/v1/checkout/validate-shipping`, `GET /api/v1/locations/*` |
| `payment.html` | `Payment.tsx` | `/checkout/payment` | `GET /api/v1/checkout/payment-info`, `POST /api/v1/checkout/place-order` |
| `purchasesuccess.html` | `OrderSuccess.tsx` | `/orders/:orderId/success` | `GET /api/v1/orders/:orderId` |
| `view_purchase.html` | `OrderDetail.tsx` | `/orders/:orderId` | `GET /api/v1/orders/:orderId` |
| `payment_history.html` | `Orders.tsx` | `/orders` | `GET /api/v1/orders` |
| `userprof.html` | `Profile.tsx` | `/profile` | `GET /api/v1/users/me` (cần thêm), `PUT /api/v1/users/me` (cần thêm) |

### Admin Pages (Cần auth + admin role)
| HTML File | React Component | Route | API Endpoints |
|-----------|----------------|-------|---------------|
| `admin_dashboard.html` | `AdminDashboard.tsx` | `/admin` | `GET /api/v1/admin/dashboard/stats`, `GET /api/v1/admin/dashboard/revenue-chart` |
| `ad_dash.html` | `AdminDashboard.tsx` | `/admin/dashboard` | Same as above |
| `ad_product.html` | `AdminProducts.tsx` | `/admin/products` | `GET /api/v1/admin/products`, `PUT /api/v1/admin/products/:id`, `DELETE /api/v1/admin/products/:id` |
| `ad_order.html` | `AdminOrders.tsx` | `/admin/orders` | `GET /api/v1/admin/orders`, `GET /api/v1/admin/orders/stats` |
| `ad_customer.html` | `AdminCustomers.tsx` | `/admin/customers` | `GET /api/v1/admin/customers`, `PUT /api/v1/admin/customers/:id/status` |
| `ad_setting.html` | `AdminSettings.tsx` | `/admin/settings` | `GET /api/v1/admin/settings`, `PUT /api/v1/admin/settings/*` |

---

## 🔌 API Integration Plan

### Base API Configuration
```typescript
// src/services/api.ts
- Base URL: process.env.VITE_API_URL || 'http://localhost:5000/api/v1'
- Request Interceptor: Thêm Authorization header từ localStorage
- Response Interceptor: Handle 401 (logout), 403 (unauthorized), errors
- Token Refresh: Tự động refresh token khi hết hạn (nếu backend hỗ trợ)
```

### API Services Structure

#### 1. Auth Service (`auth.service.ts`)
```typescript
- login(email/username, password) → POST /api/v1/auth/login
- register(data) → POST /api/v1/auth/register
- logout() → POST /api/v1/auth/logout
- socialLogin(provider, token) → POST /api/v1/auth/social-login
- forgotPassword(email) → POST /api/v1/auth/forgot-password
- resetPassword(token, password) → POST /api/v1/auth/reset-password
- verifyForgotPasswordToken(token) → POST /api/v1/auth/verify-forgot-password
```

#### 2. Products Service (`products.service.ts`)
```typescript
- getProducts(params) → GET /api/v1/products
- getProductDetail(slug) → GET /api/v1/products/:slug
- getRelatedProducts(slug) → GET /api/v1/products/:slug/related
- getCategories(params) → GET /api/v1/categories
```

#### 3. Cart Service (`cart.service.ts`)
```typescript
- getCart() → GET /api/v1/cart
- addToCart(data) → POST /api/v1/cart/items
- updateCartItem(itemId, data) → PUT /api/v1/cart/items/:item_id
- deleteCartItem(itemId) → DELETE /api/v1/cart/items/:item_id
```

#### 4. Checkout Service (`checkout.service.ts`)
```typescript
- getCheckoutInit() → GET /api/v1/checkout/init
- validateShipping(data) → POST /api/v1/checkout/validate-shipping
- getPaymentInfo() → GET /api/v1/checkout/payment-info
- placeOrder(data) → POST /api/v1/checkout/place-order
```

#### 5. Locations Service (`locations.service.ts`)
```typescript
- getProvinces() → GET /api/v1/locations/provinces
- getDistricts(provinceId) → GET /api/v1/locations/districts/:province_id
- getWards(districtId) → GET /api/v1/locations/wards/:district_id
```

#### 6. Orders Service (`orders.service.ts`)
```typescript
- getOrders(params) → GET /api/v1/orders
- getOrderDetail(orderId) → GET /api/v1/orders/:order_id
```

#### 7. Banners Service (`banners.service.ts`)
```typescript
- getBanners(position?) → GET /api/v1/banners?position=...
```

#### 8. Contact Service (`contact.service.ts`)
```typescript
- submitContact(data) → POST /api/v1/contact/submit
```

#### 9. Admin Service (`admin.service.ts`)
```typescript
- getDashboardStats(params) → GET /api/v1/admin/dashboard/stats
- getRevenueChart(params) → GET /api/v1/admin/dashboard/revenue-chart
- getStatsOverview(params) → GET /api/v1/admin/stats/overview
- getProducts(params) → GET /api/v1/admin/products
- updateProduct(id, data) → PUT /api/v1/admin/products/:id
- deleteProduct(id) → DELETE /api/v1/admin/products/:id
- getOrders(params) → GET /api/v1/admin/orders
- getOrdersStats() → GET /api/v1/admin/orders/stats
- getCustomers(params) → GET /api/v1/admin/customers
- updateCustomerStatus(id, status) → PUT /api/v1/admin/customers/:id/status
- getSettings() → GET /api/v1/admin/settings
- updateSettingsGeneral(data) → PUT /api/v1/admin/settings/general
- uploadLogo(file) → POST /api/v1/admin/settings/logo
- updatePaymentSettings(data) → PUT /api/v1/admin/settings/payment
- updateShippingSettings(data) → PUT /api/v1/admin/settings/shipping
```

---

## 🔐 Authentication & Authorization

### Auth Flow
1. **Login/Register**: Lưu `access_token` và `refresh_token` vào localStorage
2. **Token Management**: 
   - Tự động thêm `Authorization: Bearer <token>` vào mọi request
   - Handle token expiration (401) → redirect to login
   - Optional: Auto refresh token trước khi hết hạn
3. **Protected Routes**: 
   - Sử dụng `PrivateRoute` component để bảo vệ routes cần auth
   - Sử dụng `AdminRoute` component để bảo vệ admin routes
4. **Auth Context**: 
   - Quản lý user state, login/logout functions
   - Provide user info cho toàn bộ app

### User Profile API (Cần bổ sung Backend)
**Hiện tại backend chưa có API để:**
- `GET /api/v1/users/me` - Lấy thông tin user hiện tại
- `PUT /api/v1/users/me` - Cập nhật thông tin user

**Đề xuất thêm vào Backend:**
```typescript
// routes/users.routes.ts
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
usersRouter.put('/me', accessTokenValidator, wrapRequestHandler(updateMeController))
```

---

## 🛒 State Management

### Contexts

#### 1. AuthContext
```typescript
- user: User | null
- isAuthenticated: boolean
- isLoading: boolean
- login(email, password)
- logout()
- register(data)
```

#### 2. CartContext
```typescript
- items: CartItem[]
- totalItems: number
- totalPrice: number
- isLoading: boolean
- addToCart(product, quantity, size, color)
- updateQuantity(itemId, quantity)
- removeItem(itemId)
- clearCart()
- fetchCart() // Sync với backend
```

#### 3. ThemeContext
```typescript
- theme: 'light' | 'dark'
- toggleTheme()
```

### Custom Hooks
- `useAuth()` - Access auth context
- `useCart()` - Access cart context
- `useProducts()` - Fetch và quản lý products
- `useApi()` - Generic API hook với loading/error states

---

## 🎨 Styling & UI Components

### Tailwind Config
Giữ nguyên config từ HTML:
```javascript
{
  primary: "#19b3e6",
  background-light: "#f6f7f8",
  background-dark: "#111d21",
  text-main: "#0e181b",
  text-sub: "#4e8597",
  fontFamily: { display: ["Manrope", "sans-serif"] }
}
```

### Common Components
1. **Header** - Navigation, search, cart icon, user menu
2. **Footer** - Links, social media, contact info
3. **Button** - Primary, secondary, outline variants
4. **Input** - Text, email, password, number với validation
5. **Select** - Dropdown với search (cho locations)
6. **Modal** - Reusable modal component
7. **Loading** - Spinner, skeleton loaders
8. **ProductCard** - Hiển thị product với image, name, price
9. **Pagination** - Cho product list, orders list
10. **Breadcrumb** - Navigation breadcrumb

---

## 🚀 Implementation Phases

### Phase 1: Setup & Foundation (Week 1)
- [ ] **Step 1: Project Setup**
  - [ ] Tạo React + TypeScript project với Vite
  - [ ] Cài đặt dependencies: React Router, Axios, React Hook Form, TailwindCSS
  - [ ] Setup folder structure
  - [ ] Configure TailwindCSS với theme từ HTML
  - [ ] Setup environment variables (.env)

- [ ] **Step 2: Core Infrastructure**
  - [ ] Tạo API service layer (api.ts với interceptors)
  - [ ] Setup TypeScript types/interfaces
  - [ ] Tạo utility functions (formatters, validators)
  - [ ] Setup routing structure

- [ ] **Step 3: Common Components**
  - [ ] Header component (responsive, với cart badge)
  - [ ] Footer component
  - [ ] Button, Input, Select components
  - [ ] Loading, Error states
  - [ ] Modal component

### Phase 2: Authentication & User Flow (Week 2)
- [ ] **Step 1: Auth Pages**
  - [ ] Login page với form validation
  - [ ] Signup page với form validation
  - [ ] Forgot Password page
  - [ ] Reset Password page

- [ ] **Step 2: Auth Service & Context**
  - [ ] Implement auth.service.ts
  - [ ] Tạo AuthContext
  - [ ] Implement useAuth hook
  - [ ] PrivateRoute component
  - [ ] Token management (localStorage, auto refresh)

- [ ] **Step 3: User Profile**
  - [ ] Profile page (cần backend API `/users/me`)
  - [ ] Update profile functionality

### Phase 3: Product Catalog (Week 3)
- [ ] **Step 1: Product Services**
  - [ ] Implement products.service.ts
  - [ ] Implement categories.service.ts
  - [ ] Implement banners.service.ts

- [ ] **Step 2: Product Pages**
  - [ ] Home page (banners, featured products)
  - [ ] Products listing page (filters, sort, pagination)
  - [ ] Product detail page (images, variants, related products)
  - [ ] Categories page
  - [ ] Search page

- [ ] **Step 3: Product Components**
  - [ ] ProductCard component
  - [ ] ProductList component
  - [ ] ProductFilters component
  - [ ] ProductImageGallery component
  - [ ] Size/Color selector

### Phase 4: Shopping Cart & Checkout (Week 4)
- [ ] **Step 1: Cart Service & Context**
  - [ ] Implement cart.service.ts
  - [ ] Tạo CartContext
  - [ ] Implement useCart hook
  - [ ] Sync cart với backend

- [ ] **Step 2: Cart Page**
  - [ ] Cart page với item list
  - [ ] Update quantity, remove items
  - [ ] Cart summary (subtotal, shipping, total)

- [ ] **Step 3: Checkout Flow**
  - [ ] Implement locations.service.ts
  - [ ] Implement checkout.service.ts
  - [ ] Checkout page (shipping info form)
  - [ ] Payment page (payment method selection)
  - [ ] Order success page
  - [ ] Address form với province/district/ward selection

### Phase 5: Orders & History (Week 5)
- [ ] **Step 1: Orders Service**
  - [ ] Implement orders.service.ts

- [ ] **Step 2: Orders Pages**
  - [ ] Orders list page (history)
  - [ ] Order detail page
  - [ ] Order status tracking

### Phase 6: Admin Dashboard (Week 6)
- [ ] **Step 1: Admin Service**
  - [ ] Implement admin.service.ts
  - [ ] AdminRoute component (check admin role)

- [ ] **Step 2: Admin Pages**
  - [ ] Admin Dashboard (stats, charts)
  - [ ] Admin Products (list, edit, delete)
  - [ ] Admin Orders (list, filter, stats)
  - [ ] Admin Customers (list, block/unblock)
  - [ ] Admin Settings (general, logo, payment, shipping)

- [ ] **Step 3: Admin Components**
  - [ ] Data tables với pagination, filters
  - [ ] Charts (revenue chart)
  - [ ] File upload (logo)
  - [ ] Form components cho settings

### Phase 7: Static Pages & Polish (Week 7)
- [ ] **Step 1: Static Pages**
  - [ ] About/Introduction page
  - [ ] Contact page với form
  - [ ] Terms & Policies page
  - [ ] Size Guide page
  - [ ] 404 Not Found page

- [ ] **Step 2: Enhancements**
  - [ ] Dark mode toggle (ThemeContext)
  - [ ] Responsive design improvements
  - [ ] Loading states, error handling
  - [ ] Toast notifications
  - [ ] Form validation improvements

- [ ] **Step 3: Testing & Optimization**
  - [ ] Test all user flows
  - [ ] Performance optimization
  - [ ] SEO optimization (meta tags, structured data)
  - [ ] Accessibility improvements

---

## 🔧 Backend Adjustments & Recommendations

### APIs Cần Bổ Sung

#### 1. User Profile APIs
```typescript
// routes/users.routes.ts
GET /api/v1/users/me
  - Lấy thông tin user hiện tại
  - Header: Authorization: Bearer <token>
  - Response: { user: { id, username, email, full_name, phone, address, ... } }

PUT /api/v1/users/me
  - Cập nhật thông tin user
  - Header: Authorization: Bearer <token>
  - Body: { full_name?, phone?, address?, date_of_birth? }
```

#### 2. Size Charts API (Optional)
```typescript
// routes/products.routes.ts hoặc routes/categories.routes.ts
GET /api/v1/size-charts
  - Lấy bảng size guide
  - Query: { category_id?, gender? }
  - Response: { size_charts: [...] }
```

### API Response Format Standardization
Đảm bảo tất cả API responses có format nhất quán:
```typescript
// Success response
{
  message: string,
  data: any,
  meta?: { page, limit, total, ... }
}

// Error response
{
  message: string,
  errors?: { field: string, message: string }[]
}
```

### CORS Configuration
Đảm bảo backend cho phép CORS từ frontend:
```typescript
// be/src/index.ts
import cors from 'cors'
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
```

### File Upload Support
Nếu cần upload ảnh (logo, product images):
- Cài đặt `multer` hoặc `express-fileupload`
- Tạo endpoint `/api/v1/upload` hoặc tích hợp vào các endpoints hiện có
- Trả về URL của file đã upload

---

## 📦 Dependencies Cần Cài

### Core
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Optional (nếu cần)
```json
{
  "dependencies": {
    "zustand": "^4.4.0",           // Nếu muốn dùng Zustand thay Context
    "react-hot-toast": "^2.4.0",   // Toast notifications
    "recharts": "^2.10.0",         // Charts cho admin dashboard
    "date-fns": "^2.30.0",          // Date formatting
    "react-query": "^3.39.0"        // Nếu muốn dùng React Query
  }
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- Test utility functions
- Test custom hooks
- Test service functions

### Integration Tests
- Test API integration
- Test form submissions
- Test authentication flow

### E2E Tests (Optional)
- Test complete user journeys
- Test checkout flow
- Test admin workflows

---

## 📝 Notes & Considerations

### Performance
- Lazy load routes (React.lazy)
- Image optimization (lazy loading, WebP format)
- Code splitting
- Memoization cho expensive components

### SEO
- Meta tags cho mỗi page
- Open Graph tags
- Structured data (JSON-LD) cho products
- Sitemap generation

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

### Security
- XSS prevention (sanitize user input)
- CSRF protection (nếu cần)
- Secure token storage
- Input validation

---

## ✅ Checklist Trước Khi Deploy

- [ ] Tất cả routes hoạt động đúng
- [ ] Authentication flow hoàn chỉnh
- [ ] Cart sync với backend
- [ ] Checkout flow hoàn chỉnh
- [ ] Admin dashboard đầy đủ chức năng
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Dark mode hoạt động
- [ ] Error handling đầy đủ
- [ ] Loading states cho tất cả async operations
- [ ] Form validation
- [ ] API error messages hiển thị đúng
- [ ] Environment variables configured
- [ ] Build production thành công
- [ ] Performance optimization
- [ ] SEO optimization

---

## 🎯 Next Steps

1. **Bắt đầu với Phase 1**: Setup project và core infrastructure
2. **Review Backend APIs**: Đảm bảo tất cả endpoints hoạt động đúng
3. **Bổ sung Backend APIs**: Thêm `/users/me` endpoints nếu chưa có
4. **Implement từng Phase**: Theo thứ tự từ Phase 1 → Phase 7
5. **Testing**: Test từng feature sau khi implement
6. **Integration**: Test tích hợp frontend-backend
7. **Deploy**: Deploy frontend và backend

---

**Lưu ý**: Kế hoạch này có thể điều chỉnh dựa trên tiến độ và yêu cầu thực tế. Ưu tiên implement các features core trước (auth, products, cart, checkout), sau đó mới đến admin và các features phụ.
