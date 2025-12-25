# 📋 Công Việc của Hướng - Cart & Checkout Flow

## 👤 Thông Tin
- **Người phụ trách**: Hướng
- **Nhóm trang**: Cart & Checkout Flow
- **Số trang**: 4 trang
- **Mức độ**: High (Critical user flow)

---

## 📄 Danh Sách Trang Cần Làm

### 1. Cart.tsx
- **UI File**: `ui/cart.html`
- **File hiện tại**: `fe/src/pages/Cart.tsx`
- **Status**: ⚠️ Verify - Cần kiểm tra và cập nhật styling

### 2. Checkout.tsx
- **UI File**: `ui/ship.html`
- **File hiện tại**: `fe/src/pages/Checkout.tsx`
- **Status**: ⚠️ Verify - Cần verify breadcrumb và styling

### 3. Payment.tsx
- **UI File**: `ui/payment.html`
- **File hiện tại**: `fe/src/pages/Payment.tsx`
- **Status**: ⚠️ Verify - Cần steps nav và credit card form

### 4. OrderSuccess.tsx
- **UI File**: `ui/purchasesuccess.html`
- **File hiện tại**: `fe/src/pages/OrderSuccess.tsx`
- **Status**: ⚠️ Verify - Cần progress bar và layout chi tiết

---

## ✅ Checklist Chi Tiết

### 1. Cart.tsx

#### Đã có:
- ✅ Table layout với columns
- ✅ Cart item display (image, name, color, size)
- ✅ Quantity controls
- ✅ Cart summary sidebar
- ✅ Continue shopping / Checkout buttons
- ✅ Empty cart state

#### Cần làm:
- [ ] **So sánh với `ui/cart.html`:**
  - [ ] Table header styling (`bg-[#f8fbfc]` trong light mode)
  - [ ] Table border colors (`border-gray-100`, `border-gray-200`)
  - [ ] Product image size và aspect ratio
  - [ ] Product name và variant (color, size) display
  - [ ] Price formatting (đơn giá, tổng)
  - [ ] Quantity input với +/- buttons styling
  - [ ] Remove button (trash icon) styling
  - [ ] Cart summary sidebar:
    - [ ] Subtotal, shipping, discount, total
    - [ ] Discount code input
    - [ ] Checkout button styling
  - [ ] Continue shopping link
  - [ ] Empty cart state với icon và message

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Table → Cards layout
  - [ ] Price hiển thị trên mobile
  - [ ] Cart summary sticky hoặc bottom bar

- [ ] **Dark mode:**
  - [ ] Table colors
  - [ ] Border colors
  - [ ] Background colors

#### File cần xem:
- `ui/cart.html` - Reference UI
- `fe/src/pages/Cart.tsx` - File cần update
- `fe/src/components/cart/` - Components liên quan

---

### 2. Checkout.tsx

#### Đã có:
- ✅ Breadcrumb navigation
- ✅ Shipping address form
- ✅ Location selectors (Province, District, Ward)
- ✅ Order summary sidebar

#### Cần làm:
- [ ] **So sánh với `ui/ship.html`:**
  - [ ] Breadcrumb với chevron icons (material-symbols-outlined)
  - [ ] Breadcrumb active state styling
  - [ ] Form sections:
    - [ ] Contact Info section (email, phone)
    - [ ] Shipping Address section
    - [ ] Form input styling (`bg-[#f8fbfc]`, borders)
    - [ ] Label styling
    - [ ] Error message styling
  - [ ] Location selectors:
    - [ ] Province dropdown
    - [ ] District dropdown (cascading)
    - [ ] Ward dropdown (cascading)
  - [ ] "Lưu địa chỉ này cho lần mua sau" checkbox
  - [ ] Order summary sidebar:
    - [ ] Sticky positioning
    - [ ] Order items với quantity badges
    - [ ] Cost breakdown (subtotal, shipping, discount, total)
    - [ ] Discount code input
    - [ ] Continue to payment button
  - [ ] Back to cart link

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Form full width, summary below
  - [ ] Desktop: Form left, summary right sidebar

- [ ] **Dark mode:**
  - [ ] Form inputs
  - [ ] Borders
  - [ ] Backgrounds

#### File cần xem:
- `ui/ship.html` - Reference UI
- `fe/src/pages/Checkout.tsx` - File cần update
- `fe/src/components/checkout/` - Components liên quan

---

### 3. Payment.tsx

#### Đã có:
- ✅ Payment method selection
- ✅ Order summary

#### Cần làm:
- [ ] **So sánh với `ui/payment.html`:**
  - [ ] Steps navigation (Cart → Shipping → Payment → Complete)
  - [ ] Payment method cards:
    - [ ] COD (Cash on Delivery)
    - [ ] Bank transfer
    - [ ] Credit card (nếu có)
  - [ ] Payment method selection (radio buttons) styling
  - [ ] Credit card form (nếu có):
    - [ ] Card number input
    - [ ] Expiry date
    - [ ] CVV
    - [ ] Cardholder name
  - [ ] Order summary:
    - [ ] Order items
    - [ ] Shipping address display
    - [ ] Cost breakdown
  - [ ] Security badges/icons
  - [ ] Place order button
  - [ ] Back to shipping link

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile layout
  - [ ] Payment method cards responsive

- [ ] **Dark mode:**
  - [ ] Payment method cards
  - [ ] Form inputs

#### File cần xem:
- `ui/payment.html` - Reference UI
- `fe/src/pages/Payment.tsx` - File cần update

---

### 4. OrderSuccess.tsx

#### Đã có:
- ✅ Success message
- ✅ Order details
- ✅ Action buttons

#### Cần làm:
- [ ] **So sánh với `ui/purchasesuccess.html`:**
  - [ ] Progress bar với 3 steps (Giỏ hàng, Thanh toán, Xác nhận)
  - [ ] Success hero section:
    - [ ] Large check icon (size-24)
    - [ ] Success message
    - [ ] Order code display
  - [ ] Order details card:
    - [ ] Grid 2 columns cho shipping info
    - [ ] Order items list
    - [ ] Cost summary
  - [ ] Action buttons:
    - [ ] "Tiếp tục mua sắm" button
    - [ ] "Theo dõi đơn hàng" button
  - [ ] Estimated delivery date
  - [ ] Email confirmation message

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile layout
  - [ ] Grid responsive

- [ ] **Dark mode:**
  - [ ] Card backgrounds
  - [ ] Text colors

#### File cần xem:
- `ui/purchasesuccess.html` - Reference UI
- `fe/src/pages/OrderSuccess.tsx` - File cần update

---

## 🎯 Mục Tiêu

1. **User Flow**: Đảm bảo flow Cart → Checkout → Payment → Success mượt mà
2. **Styling Match**: Tất cả styling match 100% với UI gốc
3. **Form Validation**: Tất cả forms có validation đầy đủ
4. **Error Handling**: Xử lý lỗi tốt với toast notifications
5. **Responsive**: Hoạt động tốt trên mọi devices

---

## 🔧 Công Cụ & Resources

### Files Reference
- UI Files: `ui/cart.html`, `ui/ship.html`, `ui/payment.html`, `ui/purchasesuccess.html`
- Frontend Files: `fe/src/pages/Cart.tsx`, `fe/src/pages/Checkout.tsx`, `fe/src/pages/Payment.tsx`, `fe/src/pages/OrderSuccess.tsx`
- Components: `fe/src/components/cart/`, `fe/src/components/checkout/`

### API Endpoints
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart/items` - Add to cart
- `PUT /api/v1/cart/items/:item_id` - Update cart item
- `DELETE /api/v1/cart/items/:item_id` - Delete cart item
- `GET /api/v1/checkout/init` - Initialize checkout
- `POST /api/v1/checkout/validate-shipping` - Validate shipping
- `GET /api/v1/checkout/payment-info` - Get payment info
- `POST /api/v1/checkout/place-order` - Place order
- `GET /api/v1/locations/provinces` - Get provinces
- `GET /api/v1/locations/districts/:province_id` - Get districts
- `GET /api/v1/locations/wards/:district_id` - Get wards

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển

---

## 📝 Notes

- **Critical Flow**: Đây là flow quan trọng nhất, cần test kỹ
- **Form Validation**: Đảm bảo tất cả fields được validate
- **Location Selectors**: Đã được fix, nhưng cần verify lại
- **API Integration**: Đảm bảo tất cả API calls hoạt động đúng
- **Error States**: Xử lý các trường hợp lỗi (network, validation, etc.)

---

## ✅ Definition of Done

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động đúng
- [ ] Tất cả forms có validation
- [ ] API integration hoạt động
- [ ] Error handling đầy đủ
- [ ] Toast notifications hoạt động
- [ ] Không có lỗi console
- [ ] Test flow hoàn chỉnh: Cart → Checkout → Payment → Success

---

*Last Updated: 2024*

