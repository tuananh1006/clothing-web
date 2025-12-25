# Frontend Development Checklist - YORI Fashion

Checklist chi tiết cho từng phase phát triển Frontend React.

---

## 📋 Phase 1: Setup & Foundation

### Step 1: Project Setup
- [x] Tạo React + TypeScript project với Vite
  - [x] Chạy `npm create vite@latest frontend -- --template react-ts` (tạo thủ công với tên `fe`)
  - [x] Di chuyển vào thư mục `fe`
  - [x] Cài đặt dependencies cơ bản

- [x] Cài đặt Dependencies
  - [x] `npm install react-router-dom`
  - [x] `npm install axios`
  - [x] `npm install react-hook-form @hookform/resolvers zod`
  - [x] `npm install -D tailwindcss postcss autoprefixer`
  - [x] `npm install -D @types/node` (nếu cần)

- [x] Setup Folder Structure
  - [x] Tạo thư mục `src/components/common`
  - [x] Tạo thư mục `src/components/product`
  - [x] Tạo thư mục `src/components/cart`
  - [x] Tạo thư mục `src/components/checkout`
  - [x] Tạo thư mục `src/components/admin`
  - [x] Tạo thư mục `src/pages`
  - [x] Tạo thư mục `src/pages/admin`
  - [x] Tạo thư mục `src/hooks`
  - [x] Tạo thư mục `src/services`
  - [x] Tạo thư mục `src/contexts`
  - [x] Tạo thư mục `src/types`
  - [x] Tạo thư mục `src/utils`
  - [x] Tạo thư mục `public/assets`

- [x] Configure TailwindCSS
  - [x] Chạy `npx tailwindcss init -p` (tạo thủ công tailwind.config.js và postcss.config.js)
  - [x] Cấu hình `tailwind.config.js` với theme colors từ HTML
  - [x] Thêm font Manrope vào config
  - [x] Thêm Material Symbols vào `index.html`
  - [x] Test TailwindCSS hoạt động

- [x] Setup Environment Variables
  - [x] Tạo file `.env` với `VITE_API_URL=http://localhost:5000/api/v1`
  - [x] Tạo file `.env.example`
  - [x] Thêm `.env` vào `.gitignore`

### Step 2: Core Infrastructure
- [x] API Service Layer
  - [x] Tạo file `src/services/api.ts`
  - [x] Setup Axios instance với baseURL
  - [x] Implement request interceptor (thêm token)
  - [x] Implement response interceptor (handle errors, 401, 403)
  - [x] Export axios instance

- [x] TypeScript Types
  - [x] Tạo `src/types/auth.types.ts` (User, LoginRequest, RegisterRequest, etc.)
  - [x] Tạo `src/types/product.types.ts` (Product, Category, ProductVariant, etc.)
  - [x] Tạo `src/types/cart.types.ts` (CartItem, Cart, etc.)
  - [x] Tạo `src/types/order.types.ts` (Order, OrderItem, ShippingAddress, etc.)
  - [x] Tạo `src/types/api.types.ts` (ApiResponse, PaginationMeta, etc.)
  - [x] Tạo `src/types/index.ts` để export tất cả types

- [x] Utility Functions
  - [x] Tạo `src/utils/constants.ts` (API endpoints, routes, etc.)
  - [x] Tạo `src/utils/formatters.ts` (formatPrice, formatDate, etc.)
  - [x] Tạo `src/utils/validators.ts` (email, phone, password validators)
  - [x] Tạo `src/utils/storage.ts` (localStorage helpers cho token)

- [x] Routing Structure
  - [x] Tạo file `src/routes.tsx` hoặc `src/App.tsx` với routes
  - [x] Setup React Router với BrowserRouter
  - [x] Định nghĩa tất cả routes (public, protected, admin)
  - [x] Test routing cơ bản (tất cả pages đã được tạo placeholder)

### Step 3: Common Components
- [x] Header Component
  - [x] Tạo `src/components/common/Header.tsx`
  - [x] Logo và navigation links
  - [x] Search bar
  - [x] Cart icon với badge (số lượng items)
  - [x] User menu (login/signup hoặc profile dropdown)
  - [x] Dark mode toggle button
  - [x] Responsive mobile menu
  - [x] Test header trên mobile/desktop

- [x] Footer Component
  - [x] Tạo `src/components/common/Footer.tsx`
  - [x] Company info, links
  - [x] Social media icons
  - [x] Copyright
  - [x] Responsive layout

- [x] Button Component
  - [x] Tạo `src/components/common/Button.tsx`
  - [x] Variants: primary, secondary, outline, ghost
  - [x] Sizes: sm, md, lg
  - [x] Loading state
  - [x] Disabled state
  - [x] TypeScript props interface

- [x] Input Component
  - [x] Tạo `src/components/common/Input.tsx`
  - [x] Types: text, email, password, number, tel
  - [x] Label và error message
  - [x] Icon support (left/right)
  - [x] Validation error styling
  - [x] TypeScript props interface

- [x] Select Component
  - [x] Tạo `src/components/common/Select.tsx`
  - [x] Options rendering
  - [x] Placeholder
  - [x] Error state
  - [x] TypeScript props interface

- [x] Modal Component
  - [x] Tạo `src/components/common/Modal.tsx`
  - [x] Open/close functionality
  - [x] Backdrop click to close
  - [x] Escape key to close
  - [x] Size variants
  - [x] TypeScript props interface

- [x] Loading Components
  - [x] Tạo `src/components/common/Spinner.tsx`
  - [x] Tạo `src/components/common/Skeleton.tsx` (cho product cards)
  - [x] Loading states khác nhau

- [x] ProductCard Component
  - [x] Tạo `src/components/product/ProductCard.tsx`
  - [x] Product image với lazy loading
  - [x] Product name, price
  - [x] Rating (nếu có)
  - [x] Hover effects
  - [x] Link to product detail
  - [x] TypeScript props interface

- [x] Pagination Component
  - [x] Tạo `src/components/common/Pagination.tsx`
  - [x] Page numbers
  - [x] Previous/Next buttons
  - [x] Current page highlight
  - [x] TypeScript props interface

- [x] Breadcrumb Component
  - [x] Tạo `src/components/common/Breadcrumb.tsx`
  - [x] Dynamic breadcrumb items
  - [x] Home link
  - [x] TypeScript props interface

---

## 🔐 Phase 2: Authentication & User Flow

### Step 1: Auth Pages
- [x] Login Page
  - [x] Tạo `src/pages/Login.tsx`
  - [x] Form với email và password
  - [x] Form validation với React Hook Form + Zod
  - [x] Error message display
  - [x] "Remember me" checkbox
  - [x] Link to forgot password
  - [x] Link to signup
  - [x] Social login buttons (Google, Facebook) - optional
  - [x] Loading state khi submit
  - [x] Redirect sau khi login thành công

- [x] Signup Page
  - [x] Tạo `src/pages/Signup.tsx`
  - [x] Form với: first_name, last_name, email, password, password_confirmation
  - [x] Form validation (email format, password strength, match passwords)
  - [x] Error message display
  - [x] Terms & conditions checkbox
  - [x] Link to login
  - [x] Loading state khi submit
  - [x] Success message và redirect

- [x] Forgot Password Page
  - [x] Tạo `src/pages/ForgotPassword.tsx`
  - [x] Form với email input
  - [x] Validation
  - [x] Submit và hiển thị success message
  - [x] Link back to login

- [x] Reset Password Page
  - [x] Tạo `src/pages/ResetPassword.tsx`
  - [x] Form với: token (từ URL), email, new_password, confirm_password
  - [x] Validation
  - [x] Verify token trước khi hiển thị form
  - [x] Success message và redirect to login

### Step 2: Auth Service & Context
- [x] Auth Service
  - [x] Tạo `src/services/auth.service.ts`
  - [x] Implement `login(email, password)`
  - [x] Implement `register(data)`
  - [x] Implement `logout()`
  - [x] Implement `socialLogin(provider, token)`
  - [x] Implement `forgotPassword(email)`
  - [x] Implement `resetPassword(token, password)`
  - [x] Implement `verifyForgotPasswordToken(token)`
  - [x] Error handling cho mỗi function

- [x] Auth Context
  - [x] Tạo `src/contexts/AuthContext.tsx`
  - [x] State: user, isAuthenticated, isLoading
  - [x] Functions: login, logout, register
  - [x] Auto check token on mount
  - [x] Persist user state (localStorage)
  - [x] Provide context to app

- [x] useAuth Hook
  - [x] Tạo `src/hooks/useAuth.ts`
  - [x] Return auth context values
  - [x] Helper functions nếu cần

- [x] PrivateRoute Component
  - [x] Tạo `src/components/common/PrivateRoute.tsx`
  - [x] Check authentication
  - [x] Redirect to login nếu chưa auth
  - [x] Render children nếu đã auth

- [x] AdminRoute Component
  - [x] Tạo `src/components/common/AdminRoute.tsx`
  - [x] Check authentication + admin role
  - [x] Redirect nếu không đủ quyền

- [x] Token Management
  - [x] Lưu access_token vào localStorage
  - [x] Lưu refresh_token vào localStorage (nếu có)
  - [x] Auto add token vào request headers
  - [x] Handle token expiration (401) → logout và redirect
  - [x] Clear tokens khi logout

### Step 3: User Profile
- [x] Profile Page
  - [x] Tạo `src/pages/Profile.tsx`
  - [x] Hiển thị thông tin user (cần backend API `/users/me`)
  - [x] Form để update profile
  - [x] Fields: first_name, last_name, email, phonenumber, address, date_of_birth
  - [x] Avatar upload
  - [x] Validation
  - [x] Save button
  - [x] Success/error messages
  - [x] Protected route (PrivateRoute)

- [x] User Service (nếu backend đã có API)
  - [x] Tạo `src/services/users.service.ts`
  - [x] Implement `getMe()`
  - [x] Implement `updateMe(data)`
  - [x] Implement `uploadAvatar(file)`

---

## 🛍️ Phase 3: Product Catalog

### Step 1: Product Services
- [x] Products Service
  - [x] Tạo `src/services/products.service.ts`
  - [x] Implement `getProducts(params)` với query params
  - [x] Implement `getProductDetail(slug)`
  - [x] Implement `getRelatedProducts(slug)`
  - [x] Error handling

- [x] Categories Service
  - [x] Tạo `src/services/categories.service.ts`
  - [x] Implement `getCategories(params)`
  - [x] Error handling

- [x] Banners Service
  - [x] Tạo `src/services/banners.service.ts`
  - [x] Implement `getBanners(position?)`
  - [x] Error handling

### Step 2: Product Pages
- [x] Home Page
  - [x] Tạo `src/pages/Home.tsx`
  - [x] Fetch banners từ API
  - [x] Hiển thị banner carousel
  - [x] Fetch featured products
  - [x] Hiển thị featured products section
  - [x] Loading states
  - [x] Error handling

- [x] Products Listing Page
  - [x] Tạo `src/pages/Products.tsx`
  - [x] Fetch products với filters
  - [x] Filters: category, price range, rating, sort
  - [x] Pagination
  - [x] Loading states (skeleton loaders)
  - [x] Empty state
  - [x] URL params sync với filters

- [x] Product Detail Page
  - [x] Tạo `src/pages/ProductDetail.tsx`
  - [x] Fetch product detail by slug
  - [x] Image gallery (main image + thumbnails)
  - [x] Product info: name, price, description, rating
  - [x] Size selector
  - [x] Color selector (nếu có)
  - [x] Quantity selector
  - [x] Add to cart button
  - [x] Related products section
  - [x] Loading state
  - [x] Error handling (404 nếu không tìm thấy)

- [x] Categories Page
  - [x] Tạo `src/pages/Categories.tsx`
  - [x] Fetch categories
  - [x] Hiển thị categories grid
  - [x] Link to products filtered by category

- [x] Search Page
  - [x] Tạo `src/pages/Search.tsx`
  - [x] Search input với debounce
  - [x] Fetch products với search query
  - [x] Display results
  - [x] Empty state khi không có kết quả
  - [x] URL params sync với search query

### Step 3: Product Components
- [x] ProductCard Component
  - [x] Đã tạo ở Phase 1, test với real data
  - [x] Hover effects
  - [x] Link navigation

- [x] ProductList Component
  - [x] Tạo `src/components/product/ProductList.tsx`
  - [x] Grid layout
  - [x] Responsive (1-4 columns)
  - [x] Loading skeleton
  - [x] Empty state

- [x] ProductFilters Component
  - [x] Tạo `src/components/product/ProductFilters.tsx`
  - [x] Category filter (dropdown hoặc sidebar)
  - [x] Price range slider
  - [x] Rating filter
  - [x] Sort dropdown
  - [x] Clear filters button
  - [x] Mobile responsive (drawer/modal)

- [x] ProductImageGallery Component
  - [x] Tạo `src/components/product/ProductImageGallery.tsx`
  - [x] Main image display
  - [x] Thumbnail images
  - [x] Click thumbnail để đổi main image
  - [ ] Zoom functionality (optional)
  - [ ] Lightbox (optional)

- [x] SizeSelector Component
  - [x] Tạo `src/components/product/SizeSelector.tsx`
  - [x] Display available sizes
  - [x] Selected state
  - [x] Disabled state (out of stock)
  - [x] Error message nếu chưa chọn size

- [x] ColorSelector Component
  - [x] Tạo `src/components/product/ColorSelector.tsx`
  - [x] Display available colors
  - [x] Selected state
  - [x] Color swatches

---

## 🛒 Phase 4: Shopping Cart & Checkout

### Step 1: Cart Service & Context
- [x] Cart Service
  - [x] Tạo `src/services/cart.service.ts`
  - [x] Implement `getCart()`
  - [x] Implement `addToCart(data)`
  - [x] Implement `updateCartItem(itemId, data)`
  - [x] Implement `deleteCartItem(itemId)`
  - [x] Error handling

- [x] Cart Context
  - [x] Tạo `src/contexts/CartContext.tsx`
  - [x] State: items, totalItems, totalPrice, isLoading
  - [x] Functions: addToCart, updateQuantity, removeItem, clearCart, fetchCart
  - [x] Auto fetch cart on mount (nếu authenticated)
  - [x] Provide context to app

- [x] useCart Hook
  - [x] Tạo `src/hooks/useCart.ts`
  - [x] Return cart context values
  - [x] Helper functions

### Step 2: Cart Page
- [x] Cart Page
  - [x] Tạo `src/pages/Cart.tsx`
  - [x] Fetch cart từ API (sử dụng CartContext)
  - [x] Display cart items list
  - [x] Update quantity (input hoặc +/- buttons)
  - [x] Remove item button
  - [x] Cart summary (subtotal, shipping, total)
  - [x] "Continue Shopping" link
  - [x] "Proceed to Checkout" button
  - [x] Empty cart state
  - [x] Loading state
  - [x] Protected route

- [x] CartItem Component
  - [x] Tạo `src/components/cart/CartItem.tsx`
  - [x] Product image, name, price
  - [x] Size, color display
  - [x] Quantity selector
  - [x] Remove button
  - [x] Subtotal calculation
  - [x] TypeScript props interface

- [x] CartSummary Component
  - [x] Tạo `src/components/cart/CartSummary.tsx`
  - [x] Subtotal
  - [x] Shipping (estimated hoặc calculated)
  - [x] Total
  - [x] Checkout button

### Step 3: Checkout Flow
- [x] Locations Service
  - [x] Tạo `src/services/locations.service.ts`
  - [x] Implement `getProvinces()`
  - [x] Implement `getDistricts(provinceId)`
  - [x] Implement `getWards(districtId)`
  - [x] Error handling

- [x] Checkout Service
  - [x] Tạo `src/services/checkout.service.ts`
  - [x] Implement `getCheckoutInit()`
  - [x] Implement `validateShipping(data)`
  - [x] Implement `getPaymentInfo()`
  - [x] Implement `placeOrder(data)`
  - [x] Error handling

- [x] Checkout Page (Shipping Info)
  - [x] Tạo `src/pages/Checkout.tsx`
  - [x] Fetch checkout init data
  - [x] Shipping address form:
    - [x] Full name
    - [x] Phone
    - [x] Email
    - [x] Province dropdown (fetch từ API)
    - [x] District dropdown (fetch khi chọn province)
    - [x] Ward dropdown (fetch khi chọn district)
    - [x] Address (text input)
  - [x] Billing address (same as shipping checkbox)
  - [x] Form validation
  - [x] "Continue to Payment" button
  - [x] Loading state
  - [x] Protected route

- [x] Payment Page
  - [x] Tạo `src/pages/Payment.tsx`
  - [x] Fetch payment info (methods available)
  - [x] Payment method selection (radio buttons)
  - [x] Order summary (items, shipping, total)
  - [x] Note field (optional)
  - [x] "Place Order" button
  - [x] Form validation
  - [x] Loading state
  - [x] Success → redirect to order success page
  - [x] Protected route

- [x] Order Success Page
  - [x] Tạo `src/pages/OrderSuccess.tsx`
  - [x] Fetch order details by orderId (từ URL params)
  - [x] Display order confirmation
  - [x] Order number, items, total
  - [x] "View Order" link
  - [x] "Continue Shopping" link
  - [x] Protected route

- [x] Address Form Component
  - [x] Tạo `src/components/checkout/AddressForm.tsx`
  - [x] Province/District/Ward cascading selects
  - [x] Auto fetch khi select province/district
  - [x] Loading states cho dropdowns
  - [x] Reusable cho shipping và billing

- [x] OrderSummary Component
  - [x] Tạo `src/components/checkout/OrderSummary.tsx`
  - [x] Display order items
  - [x] Subtotal, shipping, total
  - [x] Reusable cho checkout và payment pages

---

## 📦 Phase 5: Orders & History

### Step 1: Orders Service
- [x] Orders Service
  - [x] Tạo `src/services/orders.service.ts`
  - [x] Implement `getOrders(params)` với filters
  - [x] Implement `getOrderDetail(orderId)`
  - [x] Error handling

### Step 2: Orders Pages
- [x] Orders List Page
  - [x] Tạo `src/pages/Orders.tsx`
  - [x] Fetch orders với filters (status, date range)
  - [x] Display orders list
  - [x] Order card với: order number, date, status, total
  - [x] Filter by status
  - [x] Pagination
  - [x] Loading state
  - [x] Empty state
  - [x] Protected route

- [x] Order Detail Page
  - [x] Tạo `src/pages/OrderDetail.tsx`
  - [x] Fetch order detail by orderId
  - [x] Display order info:
    - [x] Order number, date, status
    - [x] Shipping address
    - [x] Billing address
    - [x] Order items (list)
    - [x] Payment method
    - [x] Subtotal, shipping, total
    - [x] Order notes
  - [x] Status timeline/progress (optional)
  - [x] "Back to Orders" link
  - [x] Loading state
  - [x] Error handling (404)
  - [x] Protected route

- [x] OrderItem Component
  - [x] Tạo `src/components/orders/OrderItem.tsx`
  - [x] Product image, name
  - [x] Size, color
  - [x] Quantity, price
  - [x] Subtotal

- [x] OrderCard Component
  - [x] Tạo `src/components/orders/OrderCard.tsx`
  - [x] Order summary
  - [x] Link to order detail
  - [x] Status badge

---

## 👨‍💼 Phase 6: Admin Dashboard

### Step 1: Admin Service
- [x] Admin Service
  - [x] Tạo `src/services/admin.service.ts`
  - [x] Implement `getDashboardStats(params)`
  - [x] Implement `getRevenueChart(params)`
  - [x] Implement `getStatsOverview(params)`
  - [x] Implement `getProducts(params)`
  - [x] Implement `updateProduct(id, data)`
  - [x] Implement `deleteProduct(id)`
  - [x] Implement `getOrders(params)`
  - [x] Implement `getOrdersStats()`
  - [x] Implement `getCustomers(params)`
  - [x] Implement `updateCustomerStatus(id, status)`
  - [x] Implement `getSettings()`
  - [x] Implement `updateSettingsGeneral(data)`
  - [x] Implement `uploadLogo(file)`
  - [x] Implement `updatePaymentSettings(data)`
  - [x] Implement `updateShippingSettings(data)`
  - [x] Error handling

- [x] AdminRoute Component
  - [x] Tạo `src/components/common/AdminRoute.tsx`
  - [x] Check authentication
  - [x] Check admin role (từ user object)
  - [x] Redirect nếu không phải admin
  - [x] Render children nếu là admin

### Step 2: Admin Pages
- [x] Admin Dashboard Page
  - [x] Tạo `src/pages/admin/Dashboard.tsx`
  - [x] Fetch dashboard stats
  - [x] Display stats cards (total revenue, orders, customers, products)
  - [x] Fetch revenue chart data
  - [x] Display revenue chart (line/bar chart)
  - [x] Date range filter
  - [x] Loading states
  - [x] Admin route protection

- [x] Admin Products Page
  - [x] Tạo `src/pages/admin/Products.tsx`
  - [x] Fetch products với filters
  - [x] Data table với columns: image, name, category, price, stock, status, actions
  - [x] Filters: keyword, category, status
  - [x] Pagination
  - [x] "Add Product" button (nếu có API)
  - [x] Edit button (link to edit page hoặc modal)
  - [x] Delete button với confirmation
  - [x] Loading state
  - [x] Admin route protection

- [x] Admin Orders Page
  - [x] Tạo `src/pages/admin/Orders.tsx`
  - [x] Fetch orders với filters
  - [x] Fetch order stats
  - [x] Display stats cards
  - [x] Data table với columns: order number, customer, date, total, status, actions
  - [x] Filters: keyword, status, date range
  - [x] Pagination
  - [x] View detail button
  - [x] Update status functionality (nếu có API)
  - [x] Loading state
  - [x] Admin route protection

- [x] Admin Customers Page
  - [x] Tạo `src/pages/admin/Customers.tsx`
  - [x] Fetch customers với filters
  - [x] Data table với columns: name, email, phone, orders count, status, actions
  - [x] Filters: keyword, status
  - [x] Pagination
  - [x] View detail button
  - [x] Block/Unblock button
  - [x] Loading state
  - [x] Admin route protection

- [x] Admin Settings Page
  - [x] Tạo `src/pages/admin/Settings.tsx`
  - [x] Fetch settings
  - [x] General settings tab:
    - [x] Store name, email, phone, address
    - [x] Save button
  - [x] Logo tab:
    - [x] Current logo display
    - [x] Upload new logo
    - [x] Save button
  - [x] Payment settings tab:
    - [x] Payment methods configuration
    - [x] Save button
  - [x] Shipping settings tab:
    - [x] Shipping methods, rates
    - [x] Save button
  - [x] Loading state
  - [x] Success/error messages
  - [x] Admin route protection

### Step 3: Admin Components
- [x] DataTable Component
  - [x] Tạo `src/components/admin/DataTable.tsx`
  - [x] Generic table với columns config
  - [x] Sorting
  - [x] Pagination
  - [x] Loading state
  - [x] Empty state
  - [x] TypeScript generic props

- [x] StatsCard Component
  - [x] Tạo `src/components/admin/StatsCard.tsx`
  - [x] Title, value, icon
  - [x] Trend indicator (optional)
  - [x] Reusable cho dashboard

- [x] Chart Component
  - [x] Tạo `src/components/admin/Chart.tsx` (sử dụng recharts)
  - [x] Line chart cho revenue
  - [x] Configurable chart type
  - [x] Responsive

- [x] FileUpload Component
  - [x] Tạo `src/components/admin/FileUpload.tsx`
  - [x] Drag & drop
  - [x] File preview
  - [x] Progress indicator
  - [x] Error handling

- [x] SettingsForm Components
  - [x] Tạo `src/components/admin/SettingsForm.tsx` (đã tích hợp vào Settings page)
  - [x] General settings form
  - [x] Payment settings form
  - [x] Shipping settings form

---

## 📄 Phase 7: Static Pages & Polish

### Step 1: Static Pages
- [x] About/Introduction Page
  - [x] Tạo `src/pages/About.tsx`
  - [x] Static content (copy từ HTML)
  - [x] Responsive layout

- [x] Contact Page
  - [x] Tạo `src/pages/Contact.tsx`
  - [x] Contact form với: name, email, message
  - [x] Form validation
  - [x] Submit to API (`/api/v1/contact/submit`)
  - [x] Success message
  - [x] Static content (address, phone, etc.)

- [x] Terms & Policies Page
  - [x] Tạo `src/pages/Terms.tsx`
  - [x] Static content (copy từ HTML)
  - [x] Responsive layout

- [x] Size Guide Page
  - [x] Tạo `src/pages/SizeGuide.tsx`
  - [x] Static content (copy từ HTML)
  - [x] Size chart table
  - [x] Responsive layout
  - [x] Optional: Fetch từ API nếu có `/api/v1/size-charts`

- [x] 404 Not Found Page
  - [x] Tạo `src/pages/NotFound.tsx`
  - [x] 404 message
  - [x] "Go Home" button
  - [x] Styled theo design

### Step 2: Enhancements
- [x] Dark Mode
  - [x] Tạo `src/contexts/ThemeContext.tsx`
  - [x] Toggle function
  - [x] Persist theme preference (localStorage)
  - [x] Apply theme class to html element
  - [x] Test tất cả pages với dark mode

- [ ] Responsive Design
  - [ ] Test tất cả pages trên mobile (375px, 768px)
  - [ ] Test trên tablet (1024px)
  - [ ] Test trên desktop (1920px)
  - [ ] Fix responsive issues

- [x] Loading States
  - [x] Skeleton loaders cho product lists
  - [x] Spinner cho buttons
  - [x] Loading overlay cho forms
  - [x] Ensure không có flash of content

- [x] Error Handling
  - [x] Error boundary component
  - [x] Error messages cho API errors
  - [x] Network error handling
  - [x] 404 handling
  - [x] 500 error page

- [x] Toast Notifications
  - [x] Cài đặt `react-hot-toast` hoặc tự tạo
  - [x] Success toasts (add to cart, order placed, etc.)
  - [x] Error toasts (API errors)
  - [x] Info toasts

- [x] Form Validation
  - [x] Review tất cả forms
  - [x] Ensure validation messages rõ ràng
  - [x] Real-time validation feedback
  - [x] Prevent duplicate submissions

### Step 3: Testing & Optimization
- [ ] User Flow Testing
  - [ ] Test complete registration → login → browse → add to cart → checkout → order flow
  - [ ] Test admin login → dashboard → manage products/orders flow
  - [ ] Test error scenarios (invalid login, out of stock, etc.)

- [ ] Performance Optimization
  - [ ] Lazy load routes (React.lazy)
  - [ ] Image optimization (lazy loading, WebP)
  - [ ] Code splitting
  - [ ] Memoization cho expensive components
  - [ ] Check bundle size

- [ ] SEO Optimization
  - [ ] Meta tags cho mỗi page (react-helmet hoặc tương tự)
  - [ ] Open Graph tags
  - [ ] Structured data (JSON-LD) cho products
  - [ ] Sitemap generation (optional)

- [ ] Accessibility
  - [ ] ARIA labels cho interactive elements
  - [ ] Keyboard navigation
  - [ ] Focus management
  - [ ] Screen reader testing (optional)

- [ ] Cross-browser Testing
  - [ ] Test trên Chrome
  - [ ] Test trên Firefox
  - [ ] Test trên Safari
  - [ ] Test trên Edge

---

## ✅ Final Checklist

### Pre-Deployment
- [ ] Tất cả routes hoạt động đúng
- [ ] Authentication flow hoàn chỉnh
- [ ] Cart sync với backend
- [ ] Checkout flow hoàn chỉnh (test với test payment)
- [ ] Admin dashboard đầy đủ chức năng
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động
- [ ] Error handling đầy đủ
- [ ] Loading states cho tất cả async operations
- [ ] Form validation đầy đủ
- [ ] API error messages hiển thị đúng
- [ ] Environment variables configured
- [ ] Build production thành công (`npm run build`)
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Performance acceptable (Lighthouse score > 80)

### Documentation
- [ ] README.md với setup instructions
- [ ] API integration documentation
- [ ] Environment variables documentation
- [ ] Deployment guide (nếu có)

### Code Quality
- [ ] Code formatted (Prettier)
- [ ] No linting errors
- [ ] TypeScript strict mode (nếu có)
- [ ] Consistent code style
- [ ] Comments cho complex logic

---

## 📝 Notes

- Check off từng item khi hoàn thành
- Có thể thêm sub-tasks cho các items phức tạp
- Review checklist trước khi chuyển sang phase tiếp theo
- Update checklist nếu có thay đổi requirements

