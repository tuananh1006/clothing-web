# 📋 Công Việc của Tuấn - Orders & Profile Pages

## 👤 Thông Tin
- **Người phụ trách**: Tuấn
- **Nhóm trang**: Orders & Profile
- **Số trang**: 3 trang
- **Mức độ**: Medium-High

---

## 📄 Danh Sách Trang Cần Làm

### 1. Orders.tsx
- **UI File**: `ui/view_purchase.html` (list view)
- **File hiện tại**: `fe/src/pages/Orders.tsx`
- **Status**: ⚠️ Verify - Cần kiểm tra và cập nhật styling

### 2. OrderDetail.tsx
- **UI File**: `ui/view_purchase.html` (detail view)
- **File hiện tại**: `fe/src/pages/OrderDetail.tsx`
- **Status**: ⚠️ Verify - Cần timeline component

### 3. Profile.tsx
- **UI File**: `ui/userprof.html`
- **File hiện tại**: `fe/src/pages/Profile.tsx`
- **Status**: ⚠️ Verify - Cần sidebar navigation

---

## ✅ Checklist Chi Tiết

### 1. Orders.tsx

#### Đã có:
- ✅ Orders list với status filters
- ✅ Pagination
- ✅ Order cards với thông tin cơ bản

#### Cần làm:
- [ ] **So sánh với `ui/view_purchase.html` (list view):**
  - [ ] Page header ("Đơn hàng của tôi")
  - [ ] Status filter tabs/buttons:
    - [ ] Tất cả
    - [ ] Chờ xử lý
    - [ ] Đang giao
    - [ ] Hoàn thành
    - [ ] Đã hủy
  - [ ] Order card layout:
    - [ ] Order code và date
    - [ ] Order items preview (images)
    - [ ] Total amount
    - [ ] Status badge
    - [ ] Action buttons (Xem chi tiết, Hủy đơn, etc.)
  - [ ] Empty state ("Bạn chưa có đơn hàng nào")
  - [ ] Pagination styling

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Order cards stack vertically
  - [ ] Tablet/Desktop: Grid layout

- [ ] **Dark mode:**
  - [ ] Order card backgrounds
  - [ ] Status badges
  - [ ] Borders

#### File cần xem:
- `ui/view_purchase.html` - Reference UI
- `fe/src/pages/Orders.tsx` - File cần update
- `fe/src/components/orders/` - Components liên quan

---

### 2. OrderDetail.tsx

#### Đã có:
- ✅ Order items display
- ✅ Shipping info
- ✅ Cost summary
- ✅ Note field

#### Cần làm:
- [ ] **So sánh với `ui/view_purchase.html` (detail view):**
  - [ ] Page header với breadcrumb
  - [ ] Order timeline/status progress:
    - [ ] Chờ xử lý
    - [ ] Đang xử lý
    - [ ] Đang giao
    - [ ] Hoàn thành
    - [ ] (Hoặc Đã hủy)
  - [ ] Order info section:
    - [ ] Order code
    - [ ] Order date
    - [ ] Status badge
  - [ ] Order items section:
    - [ ] Item cards với image, name, variant, quantity, price
    - [ ] Total items count
  - [ ] Shipping info section:
    - [ ] Receiver name
    - [ ] Phone
    - [ ] Email
    - [ ] Address (full address string)
    - [ ] Estimated delivery
  - [ ] Payment info section:
    - [ ] Payment method
    - [ ] Payment status
  - [ ] Cost summary:
    - [ ] Subtotal
    - [ ] Shipping fee
    - [ ] Discount
    - [ ] Total
  - [ ] Note section (nếu có)
  - [ ] Action buttons:
    - [ ] Cancel order (nếu status = pending)
    - [ ] Track order (nếu status = shipping)
    - [ ] Reorder
    - [ ] Back to orders list

- [ ] **Timeline Component:**
  - [ ] Tạo component `OrderTimeline.tsx` trong `fe/src/components/orders/`
  - [ ] Hiển thị các bước với icons
  - [ ] Active step highlighted
  - [ ] Completed steps với checkmark
  - [ ] Pending steps với gray color

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Sections stack vertically
  - [ ] Desktop: 2 columns layout (items + info)

- [ ] **Dark mode:**
  - [ ] Timeline colors
  - [ ] Card backgrounds
  - [ ] Text colors

#### File cần xem:
- `ui/view_purchase.html` - Reference UI
- `fe/src/pages/OrderDetail.tsx` - File cần update
- `fe/src/components/orders/` - Components liên quan

---

### 3. Profile.tsx

#### Đã có:
- ✅ Profile form với các fields
- ✅ Avatar upload section

#### Cần làm:
- [ ] **So sánh với `ui/userprof.html`:**
  - [ ] Sidebar navigation:
    - [ ] Thông tin cá nhân (active)
    - [ ] Địa chỉ
    - [ ] Đơn hàng
    - [ ] Đổi mật khẩu
    - [ ] Đăng xuất
  - [ ] Main content area:
    - [ ] Profile form section:
      - [ ] Avatar upload với preview
      - [ ] First name, Last name
      - [ ] Email (readonly hoặc editable)
      - [ ] Phone
      - [ ] Date of birth (nếu có)
      - [ ] Address
      - [ ] Save button
    - [ ] Address book section (nếu có):
      - [ ] List of saved addresses
      - [ ] Add new address button
      - [ ] Edit/Delete address
    - [ ] Change password section (nếu có):
      - [ ] Current password
      - [ ] New password
      - [ ] Confirm password
      - [ ] Change password button

- [ ] **Sidebar Component:**
  - [ ] Tạo component `ProfileSidebar.tsx` trong `fe/src/components/common/`
  - [ ] Navigation links với active state
  - [ ] Icons cho mỗi menu item

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Sidebar → Dropdown hoặc bottom nav
  - [ ] Desktop: Sidebar left, content right

- [ ] **Dark mode:**
  - [ ] Sidebar background
  - [ ] Form inputs
  - [ ] Borders

#### File cần xem:
- `ui/userprof.html` - Reference UI
- `fe/src/pages/Profile.tsx` - File cần update
- `fe/src/components/common/` - Components liên quan

---

## 🎯 Mục Tiêu

1. **Timeline Component**: Tạo component timeline đẹp và reusable
2. **Sidebar Navigation**: Tạo sidebar navigation cho Profile page
3. **Styling Match**: Tất cả styling match 100% với UI gốc
4. **User Experience**: Đảm bảo UX tốt khi xem đơn hàng và quản lý profile

---

## 🔧 Công Cụ & Resources

### Files Reference
- UI Files: `ui/view_purchase.html`, `ui/userprof.html`
- Frontend Files: `fe/src/pages/Orders.tsx`, `fe/src/pages/OrderDetail.tsx`, `fe/src/pages/Profile.tsx`
- Components: `fe/src/components/orders/`, `fe/src/components/common/`

### API Endpoints
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:order_id` - Order detail
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/avatar` - Upload avatar

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển

---

## 📝 Notes

- **Timeline Component**: Có thể reuse cho các pages khác
- **Sidebar Navigation**: Có thể tạo component chung cho Profile
- **Order Status**: Đảm bảo status mapping đúng với backend
- **Avatar Upload**: Đã có API, chỉ cần verify UI

---

## ✅ Definition of Done

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động đúng
- [ ] Timeline component hoạt động (OrderDetail)
- [ ] Sidebar navigation hoạt động (Profile)
- [ ] API integration hoạt động
- [ ] Không có lỗi console

---

*Last Updated: 2024*

