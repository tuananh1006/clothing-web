# 📋 Công Việc của Khoa - Admin Pages

## 👤 Thông Tin
- **Người phụ trách**: Khoa
- **Nhóm trang**: Admin Pages
- **Số trang**: 5 trang
- **Mức độ**: High (Admin functionality)

---

## 📄 Danh Sách Trang Cần Làm

### 1. Admin Dashboard.tsx
- **UI File**: `ui/admin_dashboard.html`, `ui/ad_dash.html`
- **File hiện tại**: `fe/src/pages/admin/Dashboard.tsx`
- **Status**: ⚠️ Verify - Cần date range buttons, pie chart, top products

### 2. Admin Products.tsx
- **UI File**: `ui/ad_product.html`
- **File hiện tại**: `fe/src/pages/admin/Products.tsx`
- **Status**: ⚠️ Verify - Cần SKU display, filter button, table styling

### 3. Admin Orders.tsx
- **UI File**: `ui/ad_order.html`
- **File hiện tại**: `fe/src/pages/admin/Orders.tsx`
- **Status**: ⚠️ Verify - Cần header buttons, status filter buttons

### 4. Admin Customers.tsx
- **UI File**: `ui/ad_customer.html`
- **File hiện tại**: `fe/src/pages/admin/Customers.tsx`
- **Status**: ⚠️ Verify - Cần header buttons, checkbox, avatar, total spent, sort

### 5. Admin Settings.tsx
- **UI File**: `ui/ad_setting.html`
- **File hiện tại**: `fe/src/pages/admin/Settings.tsx`
- **Status**: ⚠️ Verify - Cần header buttons, payment toggles, shipping config

---

## ✅ Checklist Chi Tiết

### 1. Admin Dashboard.tsx

#### Đã có:
- ✅ AdminLayout với sidebar và top header
- ✅ Stats cards (4 cards: Doanh thu, Đơn hàng, Khách hàng, Sản phẩm)
- ✅ Revenue chart với line chart
- ✅ Date range filter (input fields)

#### Cần làm:
- [ ] **So sánh với `ui/ad_dash.html`:**
  - [ ] Header với date range buttons:
    - [ ] "Theo ngày" button
    - [ ] "Theo tuần" button
    - [ ] "Tháng này" button (active)
    - [ ] "Tùy chọn" button với calendar icon
  - [ ] Stats cards với trend badges:
    - [ ] "+15.3%" badge (green/red)
    - [ ] Icon backgrounds (blue-50, purple-50, orange-50, green-50)
    - [ ] Value formatting (345.2M VNĐ)
  - [ ] Chart section:
    - [ ] "Biểu đồ tăng trưởng" heading
    - [ ] "Xuất báo cáo" button
    - [ ] Chart với grid background (`.chart-grid` class)
    - [ ] Custom SVG paths (nếu cần)
  - [ ] "Tỷ trọng doanh mục" pie chart:
    - [ ] Pie chart với conic-gradient
    - [ ] Center text (45% - Quần áo nam)
    - [ ] Legend (Nam, Nữ, Trẻ em, Phụ kiện)
  - [ ] "Top sản phẩm bán chạy" list:
    - [ ] Product items với image
    - [ ] Product name
    - [ ] Revenue (114.5M VNĐ)
    - [ ] Progress bars
    - [ ] "Xem tất cả" link

- [ ] **Components cần tạo:**
  - [ ] `DateRangeButtons.tsx` - Date range selector
  - [ ] `PieChart.tsx` - Pie chart component (hoặc dùng recharts)
  - [ ] `TopProductsList.tsx` - Top products list với progress bars

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Stats cards stack
  - [ ] Desktop: Grid layout

- [ ] **Dark mode:**
  - [ ] Stats cards
  - [ ] Charts
  - [ ] Backgrounds

#### File cần xem:
- `ui/ad_dash.html` - Reference UI
- `fe/src/pages/admin/Dashboard.tsx` - File cần update
- `fe/src/components/admin/` - Components liên quan

---

### 2. Admin Products.tsx

#### Đã có:
- ✅ Products table với columns
- ✅ Filters (search, category, status)
- ✅ Add product button
- ✅ Edit/Delete actions
- ✅ Pagination

#### Cần làm:
- [ ] **So sánh với `ui/ad_product.html`:**
  - [ ] Header:
    - [ ] "Quản lý sản phẩm" heading
    - [ ] "Thêm sản phẩm" button với icon
  - [ ] Filters section:
    - [ ] Search input với icon
    - [ ] Category dropdown
    - [ ] Status dropdown
    - [ ] "Lọc" button với filter_list icon
  - [ ] Table styling:
    - [ ] Table header (`bg-gray-50/50`, `bg-[#f8fbfc]`)
    - [ ] Hover effects (`hover:bg-gray-50`)
    - [ ] Product image size (size-12)
    - [ ] SKU display dưới product name
    - [ ] Status badges với border (`border-green-200`)
    - [ ] Action buttons styling
  - [ ] Empty state

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Table → Cards
  - [ ] Desktop: Full table

- [ ] **Dark mode:**
  - [ ] Table colors
  - [ ] Borders
  - [ ] Backgrounds

#### File cần xem:
- `ui/ad_product.html` - Reference UI
- `fe/src/pages/admin/Products.tsx` - File cần update

---

### 3. Admin Orders.tsx

#### Đã có:
- ✅ Order stats cards (6 cards)
- ✅ Orders table
- ✅ Filters (search, status, date range)
- ✅ Pagination

#### Cần làm:
- [ ] **So sánh với `ui/ad_order.html`:**
  - [ ] Header:
    - [ ] "Quản lý Đơn hàng" heading
    - [ ] "Xuất Excel" button
    - [ ] "Tạo đơn hàng" button
  - [ ] Stats cards layout:
    - [ ] 4 cards (Tổng, Chờ xử lý, Đang giao, Đã hủy) - verify với UI
    - [ ] Icon backgrounds
    - [ ] Value display
  - [ ] Status filter buttons:
    - [ ] "Tất cả" button (active)
    - [ ] "Chờ xử lý" button
    - [ ] "Đang giao" button
    - [ ] "Hoàn thành" button
    - [ ] "Đã hủy" button
  - [ ] Table styling:
    - [ ] Table header
    - [ ] Hover effects
    - [ ] Status badges
    - [ ] Action links

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Table → Cards
  - [ ] Desktop: Full table

- [ ] **Dark mode:**
  - [ ] Table colors
  - [ ] Status badges
  - [ ] Backgrounds

#### File cần xem:
- `ui/ad_order.html` - Reference UI
- `fe/src/pages/admin/Orders.tsx` - File cần update

---

### 4. Admin Customers.tsx

#### Đã có:
- ✅ Customers table
- ✅ Filters (search, status)
- ✅ Status update modal
- ✅ Pagination

#### Cần làm:
- [ ] **So sánh với `ui/ad_customer.html`:**
  - [ ] Header:
    - [ ] "Danh sách khách hàng" heading
    - [ ] "Xuất Excel" button
    - [ ] "Thêm khách hàng" button
  - [ ] Filters section:
    - [ ] Search input với filter icon
    - [ ] Status dropdown
    - [ ] Sort dropdown (Mới nhất, Cũ nhất, Chi tiêu, Đơn hàng)
  - [ ] Table với checkbox column:
    - [ ] Checkbox ở header (select all)
    - [ ] Checkbox ở mỗi row
  - [ ] Table columns:
    - [ ] Customer với avatar (size-10 rounded-full)
    - [ ] Customer name và ID (#USR-2024001)
    - [ ] Contact info (phone, email)
    - [ ] Số đơn hàng
    - [ ] Tổng chi tiêu (formatted currency)
    - [ ] Trạng thái badge
    - [ ] Ngày tham gia
    - [ ] Actions (Xem, Khóa/Mở khóa)
  - [ ] Table styling:
    - [ ] Hover effects
    - [ ] Border colors
    - [ ] Background colors

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Table → Cards
  - [ ] Desktop: Full table

- [ ] **Dark mode:**
  - [ ] Table colors
  - [ ] Checkboxes
  - [ ] Backgrounds

#### File cần xem:
- `ui/ad_customer.html` - Reference UI
- `fe/src/pages/admin/Customers.tsx` - File cần update

---

### 5. Admin Settings.tsx

#### Đã có:
- ✅ Settings tabs (General, Logo, Payment, Shipping)
- ✅ General settings form
- ✅ Logo upload
- ✅ Payment/Shipping placeholders

#### Cần làm:
- [ ] **So sánh với `ui/ad_setting.html`:**
  - [ ] Header:
    - [ ] "Cài đặt hệ thống" heading
    - [ ] "Hủy bỏ" button
    - [ ] "Lưu thay đổi" button với save icon
  - [ ] General Settings tab:
    - [ ] Section header với icon (storefront)
    - [ ] Logo upload:
      - [ ] Circular border-dashed upload area (size-32)
      - [ ] Preview image
      - [ ] Upload instructions
    - [ ] Form fields:
      - [ ] Store name
      - [ ] Store phone
      - [ ] Store email
      - [ ] Store address (textarea)
  - [ ] Payment Settings tab:
    - [ ] Section header với icon (payments)
    - [ ] Payment methods với toggle switches:
      - [ ] COD (Cash on Delivery) - toggle ON
      - [ ] Bank Transfer - toggle ON với "Thiết lập" button
      - [ ] Momo - toggle OFF với "Cấu hình API" button
    - [ ] Toggle switch styling (w-11 h-6)
  - [ ] Shipping Settings tab:
    - [ ] Section header với icon (local_shipping)
    - [ ] "Phí vận chuyển mặc định" input
    - [ ] "Miễn phí vận chuyển cho đơn từ" input
    - [ ] "Đối tác vận chuyển" checkboxes:
      - [ ] GHN (Giao Hàng Nhanh)
      - [ ] Viettel Post
      - [ ] GHTK (nếu có)
    - [ ] Checkbox styling với hover effects

- [ ] **Components cần tạo:**
  - [ ] `ToggleSwitch.tsx` - Toggle switch component
  - [ ] `LogoUpload.tsx` - Logo upload với preview

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Tabs stack
  - [ ] Desktop: Tabs horizontal

- [ ] **Dark mode:**
  - [ ] Form inputs
  - [ ] Toggle switches
  - [ ] Backgrounds

#### File cần xem:
- `ui/ad_setting.html` - Reference UI
- `fe/src/pages/admin/Settings.tsx` - File cần update
- `fe/src/components/admin/` - Components liên quan

---

## 🎯 Mục Tiêu

1. **Admin UX**: Đảm bảo admin có UX tốt khi quản lý
2. **Components Reusable**: Tạo components có thể reuse (ToggleSwitch, DateRangeButtons, etc.)
3. **Styling Match**: Tất cả styling match 100% với UI gốc
4. **Data Visualization**: Charts và graphs đẹp và dễ đọc

---

## 🔧 Công Cụ & Resources

### Files Reference
- UI Files: `ui/admin_dashboard.html`, `ui/ad_dash.html`, `ui/ad_product.html`, `ui/ad_order.html`, `ui/ad_customer.html`, `ui/ad_setting.html`
- Frontend Files: `fe/src/pages/admin/Dashboard.tsx`, `fe/src/pages/admin/Products.tsx`, `fe/src/pages/admin/Orders.tsx`, `fe/src/pages/admin/Customers.tsx`, `fe/src/pages/admin/Settings.tsx`
- Components: `fe/src/components/admin/`

### API Endpoints
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/dashboard/revenue-chart` - Revenue chart data
- `GET /api/v1/admin/products` - List products (admin)
- `GET /api/v1/admin/orders` - List orders (admin)
- `GET /api/v1/admin/customers` - List customers (admin)
- `GET /api/v1/admin/settings` - Get settings
- `PUT /api/v1/admin/settings/general` - Update general settings
- `PUT /api/v1/admin/settings/payment` - Update payment settings
- `PUT /api/v1/admin/settings/shipping` - Update shipping settings

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển

---

## 📝 Notes

- **AdminLayout**: Đã có sẵn, chỉ cần verify styling
- **Charts**: Có thể dùng recharts hoặc tạo custom SVG
- **Toggle Switches**: Có thể tạo component chung
- **Table Components**: Có thể tạo reusable table component

---

## ✅ Definition of Done

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động đúng
- [ ] Tất cả tính năng hoạt động (CRUD, filters, etc.)
- [ ] Charts/graphs hiển thị đúng
- [ ] API integration hoạt động
- [ ] Không có lỗi console

---

*Last Updated: 2024*
