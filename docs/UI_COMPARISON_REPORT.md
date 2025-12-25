# Báo Cáo So Sánh UI - Frontend vs UI Gốc

## 📊 Tổng Quan

**Tổng số trang cần kiểm tra:** 25 trang
**Đã hoàn thành:** 2 trang (SizeGuide, Home)
**Đã kiểm tra - cần verify styling:** 23 trang (ProductDetail, Cart, Checkout, Payment, Orders, OrderDetail, Profile, Categories, Search, Login, Signup, ForgotPassword, Contact, About, Terms, NotFound, OrderSuccess, Admin Dashboard, Admin Products, Admin Orders, Admin Customers, Admin Settings)
**Còn lại:** 0 trang

**Tất cả các trang đã được kiểm tra!** ✅

---

## ✅ Trang Đã Hoàn Thành

### 1. SizeGuide (`choose_size.html` → `SizeGuide.tsx`) ✅
- ✅ Tabs navigation (4 tabs)
- ✅ Section "Cách đo cơ thể" với hình minh họa
- ✅ Bảng size Áo (Tops) với toggle CM/INCH
- ✅ Bảng size Quần (Bottoms)
- ✅ Fit Guide (Regular, Slim, Oversized)

### 2. Home (`trangchu.html` → `Home.tsx`) ✅
- ✅ Hero banner với carousel
- ✅ Brand Philosophy section (đã sửa text)
- ✅ Featured Products section với "Xem tất cả" link ở header
- ✅ Categories Section (3 cards layout: Đồ Len & Dệt Kim, Denim Tối Giản, Phụ Kiện)
- ✅ Best Sellers Section ("Bán chạy nhất tuần" với grid 4 columns)
- ✅ Newsletter Section (form đăng ký email)
- ✅ Tabs navigation (4 tabs)
- ✅ Section "Cách đo cơ thể" với hình minh họa
- ✅ Bảng size Áo (Tops) với toggle CM/INCH
- ✅ Bảng size Quần (Bottoms)
- ✅ Fit Guide (Regular, Slim, Oversized)

---

## ⚠️ Trang Cần Cập Nhật

### 1. Home Page (`trangchu.html` → `Home.tsx`) ✅ ĐÃ HOÀN THÀNH

---

### 2. Product Detail (`product.html`, `product_info.html` → `ProductDetail.tsx`)

**Đã có:**
- ✅ Product image gallery
- ✅ Product info (name, price, description)
- ✅ Size selector
- ✅ Color selector
- ✅ Quantity selector
- ✅ Add to cart button
- ✅ Related products section
- ✅ Product info badges (shipping, return, verified)

**Cần kiểm tra:**
- [ ] Product tabs (Mô tả, Thông số, Đánh giá) - chưa thấy trong UI gốc
- [ ] Styling chi tiết có match 100% không

---

### 3. Cart (`cart.html` → `Cart.tsx`)

**Đã có:**
- ✅ Table layout với columns: Sản phẩm, Đơn giá, Số lượng, Tổng, Xóa
- ✅ Cart item display (image, name, color, size)
- ✅ Quantity controls (buttons + input) - match UI
- ✅ Cart summary sidebar
- ✅ Continue shopping / Checkout buttons
- ✅ Empty cart state

**Cần kiểm tra:**
- [ ] Styling chi tiết (table header bg color `bg-[#f8fbfc]`, border colors)
- [ ] Mobile responsive (price hiển thị trên mobile)

---

### 4. Checkout (`ship.html` → `Checkout.tsx`)

**Đã có:**
- ✅ Breadcrumb navigation (Cart → Shipping → Payment → Complete)
- ✅ Shipping address form layout
- ✅ Location selectors (Province, District, Ward)
- ✅ Order summary sidebar (sticky)
- ✅ Continue to payment button
- ✅ Form sections (Contact Info, Shipping Address)

**Cần kiểm tra:**
- [ ] Breadcrumb styling với chevron icons (material-symbols-outlined)
- [ ] Form input styling (`bg-[#f8fbfc]`, border colors)
- [ ] Order summary item display với quantity badges
- [ ] Discount code input section
- [ ] "Lưu địa chỉ này cho lần mua sau" checkbox

---

### 5. Payment (`payment.html` → `Payment.tsx`)

**Đã có:**
- ✅ Payment method selection (radio buttons)
- ✅ Order summary sidebar
- ✅ Place order button
- ✅ Form validation

**Cần kiểm tra:**
- [ ] Header với steps navigation (Giỏ hàng → Vận chuyển → Thanh toán → Hoàn tất) với icons
- [ ] Payment method cards styling (border-primary khi selected, hover effects)
- [ ] Credit card form fields (số thẻ, tên chủ thẻ, ngày hết hạn, CVV) - có trong UI nhưng chưa implement
- [ ] "Lưu thông tin thẻ" checkbox
- [ ] E-Wallet badges (MoMo, ZaloPay)
- [ ] Progress bar (mobile) - "Bước 3/4"

---

### 6. Orders (`view_purchase.html` → `Orders.tsx`, `OrderDetail.tsx`)

**Orders.tsx - Đã có:**
- ✅ Orders list với status badges
- ✅ Status filter
- ✅ Pagination

**OrderDetail.tsx - Đã có:**
- ✅ Order detail page
- ✅ Order items display
- ✅ Shipping info section
- ✅ Payment info section
- ✅ Order summary sidebar

**Cần kiểm tra:**
- [ ] Order timeline component với 4 steps (Đã đặt → Đã xác nhận → Đang giao → Đã giao)
- [ ] Timeline styling (progress bar, active step với ring, completed steps)
- [ ] Action buttons (Mua lại đơn hàng, Hỗ trợ)
- [ ] "Viết đánh giá" button cho mỗi item
- [ ] Order card styling trong Orders list

---

### 7. Profile (`userprof.html` → `Profile.tsx`)

**Đã có:**
- ✅ Profile info form
- ✅ Avatar upload UI
- ✅ Form validation

**Cần kiểm tra:**
- [ ] Sidebar navigation với active state (Thông tin tài khoản, Đơn mua, Thông báo, Kho Voucher, Đăng xuất)
- [ ] Sidebar styling (active item với bg-blue-50, hover effects)
- [ ] User info header (avatar, name, "Sửa hồ sơ" link)
- [ ] Gender radio buttons (Nam, Nữ, Khác)
- [ ] Date of birth selectors (Ngày, Tháng, Năm) - 3 dropdowns
- [ ] Form layout (grid 3 columns: label | input)
- [ ] "Lưu Thay Đổi" button position

---

### 8. Categories (`categories.html` → `Categories.tsx`)

**Đã có:**
- ✅ Hero section với heading và description
- ✅ Category grid với cards (image, name, description, arrow icon)
- ✅ Hover effects và transitions

**Cần kiểm tra:**
- [ ] Filter chips section (All Items, New Arrivals, Best Sellers, Essentials) - chưa có
- [ ] "New Arrivals" section ở dưới category grid - chưa có

---

### 9. Search (`search.html` → `Search.tsx`)

**Đã có:**
- ✅ Search input với icon
- ✅ Search results grid
- ✅ Pagination
- ✅ Empty state

**Cần kiểm tra:**
- [ ] Hero search section với heading lớn "Tìm kiếm phong cách của bạn"
- [ ] Search input lớn (h-14) với button arrow_forward bên trong
- [ ] Search tags section (Từ khóa phổ biến: Linen, Quần ống rộng, Phụ kiện)
- [ ] Results toolbar với "Bộ lọc" button và Sort dropdown
- [ ] Results count display "Kết quả cho 'Áo sơ mi' (12 sản phẩm)"

---

### 10. Auth Pages

#### Login (`login.html` → `Login.tsx`)

**Đã có:**
- ✅ Split layout (form left, image right)
- ✅ Form fields (email, password)
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Social login buttons (Google, Facebook)
- ✅ Sign up link

**Cần kiểm tra:**
- [ ] Image background bên phải với gradient overlay và text "Phong cách tối giản, Cuộc sống cân bằng"
- [ ] Input styling với icons (mail, lock) - có trong UI
- [ ] Button styling chi tiết

#### Signup (`signup.html` → `Signup.tsx`)

**Đã có:**
- ✅ Split layout (image left, form right)
- ✅ Form fields (first_name, last_name, email, password, confirm_password)
- ✅ Terms checkbox
- ✅ Social login buttons
- ✅ Login link
- ✅ Password visibility toggle

**Cần kiểm tra:**
- [ ] Image background bên trái với gradient overlay và text "Gia nhập cộng đồng tối giản"
- [ ] Form layout (5/12 vs 7/12 width) - cần verify
- [ ] Input styling chi tiết

#### Forgot Password (`forgotpw.html` → `ForgotPassword.tsx`)

**Đã có:**
- ✅ Centered form layout
- ✅ Lock icon trong circle (lock_reset)
- ✅ Email input với icon
- ✅ Submit button
- ✅ Back to login link với arrow icon
- ✅ Success state
- ✅ Footer text "Cần thêm sự trợ giúp?"

**Cần kiểm tra:**
- [ ] Button text "Gửi hướng dẫn" (UI) vs "Gửi mã xác thực" (Frontend) - cần thống nhất
- [ ] Styling chi tiết (border, shadow, spacing)

---

### 11. Static Pages

#### About (`introduction.html` → `About.tsx`)

**Đã có:**
- ✅ Hero section với background image và gradient overlay
- ✅ Philosophy section với quote "Less is More"
- ✅ Origin section với image và stats (2018, 15+)
- ✅ Values section với 3 cards (Chất liệu Tự nhiên, Thiết kế Tối giản, Cam kết Bền vững)
- ✅ Craftsmanship section với images và checklist
- ✅ Quote section với founder info

**Cần kiểm tra:**
- [ ] Verify tất cả sections đã match với UI (styling, spacing, images)

#### Contact (`contract.html` → `Contact.tsx`)

**Đã có:**
- ✅ Hero section với heading và description
- ✅ Contact info section (Địa chỉ, Số điện thoại, Email, Giờ làm việc)
- ✅ Contact form với fields (name, email, message)
- ✅ Form validation và success state

**Cần kiểm tra:**
- [ ] Hero section với background blur effects (absolute positioned circles)
- [ ] Contact info với icon circles (hover effects: bg-primary, text-white)
- [ ] Form layout (lg:col-span-5 vs lg:col-span-7)
- [ ] "Chủ đề" select field - chưa có trong frontend
- [ ] "Phone" field - chưa có trong frontend
- [ ] Social media links section (FB, IG, TT) - chưa có
- [ ] Button với icon "send" - cần verify

#### Terms (`term_policies.html` → `Terms.tsx`)

**Đã có:**
- ✅ Hero section với heading và description
- ✅ Content sections với headings và paragraphs
- ✅ Breadcrumb navigation

**Cần kiểm tra:**
- [ ] Sidebar navigation với sticky position và active state
- [ ] Section numbering (1, 2, 3...) với circular badges
- [ ] Table cho shipping info (Khu vực, Thời gian, Phí vận chuyển)
- [ ] Grid layout cho payment methods (COD, Bank Transfer cards)
- [ ] Content structure chi tiết hơn (UI có nhiều sections hơn)

#### 404 (`404.html` → `NotFound.tsx`)

**Đã có:**
- ✅ 404 heading
- ✅ Error message
- ✅ Back to home button
- ✅ View products button

**Cần kiểm tra:**
- [ ] Split layout (image left, content right)
- [ ] Large "404" text với overlay badge "Lỗi không tìm thấy trang"
- [ ] Image với grayscale effect và hover transition
- [ ] Button text "Về Trang Chủ" và "Tìm sản phẩm" (vs "Về trang chủ" và "Xem sản phẩm")
- [ ] Card container với border và shadow

#### OrderSuccess (`purchasesuccess.html` → `OrderSuccess.tsx`)

**Đã có:**
- ✅ Success message với check icon
- ✅ Order details (items, cost summary, shipping info)
- ✅ Action buttons

**Cần kiểm tra:**
- [ ] Progress bar với 3 steps (Giỏ hàng, Thanh toán, Xác nhận) - chưa có
- [ ] Success hero section với large check icon (size-24)
- [ ] Order details card layout (grid 2 columns cho shipping info)
- [ ] Button text "Tiếp tục mua sắm" và "Theo dõi đơn hàng" (vs "Xem chi tiết đơn hàng" và "Tiếp tục mua sắm")
- [ ] Styling chi tiết (card-bg, dark-card-bg colors)

---

### 12. Admin Pages

#### Admin Dashboard (`admin_dashboard.html`, `ad_dash.html` → `admin/Dashboard.tsx`)

**Đã có:**
- ✅ AdminLayout với sidebar và top header
- ✅ Stats cards (4 cards: Doanh thu, Đơn hàng, Khách hàng, Sản phẩm)
- ✅ Revenue chart với line chart
- ✅ Date range filter

**Cần kiểm tra:**
- [ ] Header với date range buttons (Theo ngày, Theo tuần, Tháng này, Tùy chọn) - chưa có
- [ ] Stats cards với trend badges (+15.3%, +8.2%, etc.) và icon backgrounds (blue-50, purple-50, etc.)
- [ ] Chart với grid background và custom SVG paths (UI có custom chart, frontend dùng recharts)
- [ ] "Tỷ trọng doanh mục" pie chart - chưa có
- [ ] "Top sản phẩm bán chạy" list với progress bars - chưa có
- [ ] "Xuất báo cáo" button trên chart

#### Admin Products (`ad_product.html` → `admin/Products.tsx`)

**Đã có:**
- ✅ AdminLayout
- ✅ Products table với columns (image, name, category, price, quantity, status, actions)
- ✅ Filters (search, category, status)
- ✅ Add product button
- ✅ Edit/Delete actions
- ✅ Pagination

**Cần kiểm tra:**
- [ ] Table styling chi tiết (thead với bg-gray-50/50, hover effects)
- [ ] Product image size (size-12 trong UI vs w-16 h-16 trong frontend)
- [ ] SKU display dưới product name - chưa có
- [ ] Status badges với border (border-green-200, etc.)
- [ ] "Lọc" button với icon filter_list - chưa có (chỉ có "Xóa bộ lọc")

#### Admin Orders (`ad_order.html` → `admin/Orders.tsx`)

**Đã có:**
- ✅ AdminLayout
- ✅ Order stats cards (6 cards: Tổng, Chờ xử lý, Đang xử lý, Đang giao, Hoàn thành, Đã hủy)
- ✅ Orders table với columns
- ✅ Filters (search, status, date range)
- ✅ Pagination

**Cần kiểm tra:**
- [ ] Header buttons ("Xuất Excel", "Tạo đơn hàng") - chưa có
- [ ] Stats cards layout (4 cards trong UI vs 6 cards trong frontend) - cần verify
- [ ] Status filter buttons (Tất cả, Chờ xử lý, Đang giao, Hoàn thành, Đã hủy) - chưa có, chỉ có dropdown
- [ ] Table styling chi tiết

#### Admin Customers (`ad_customer.html` → `admin/Customers.tsx`)

**Đã có:**
- ✅ AdminLayout
- ✅ Customers table với columns
- ✅ Filters (search, status)
- ✅ Pagination
- ✅ Status update modal

**Cần kiểm tra:**
- [ ] Header buttons ("Xuất Excel", "Thêm khách hàng") - chưa có
- [ ] Table với checkbox column - chưa có
- [ ] Customer avatar trong table - chưa có
- [ ] Customer ID display (#USR-2024001) - chưa có
- [ ] "Tổng chi tiêu" column - chưa có
- [ ] Sort dropdown (Sắp xếp: Mới nhất, Cũ nhất, Chi tiêu, Đơn hàng) - chưa có
- [ ] Table styling chi tiết

#### Admin Settings (`ad_setting.html` → `admin/Settings.tsx`)

**Đã có:**
- ✅ AdminLayout
- ✅ Settings tabs (General, Logo, Payment, Shipping)
- ✅ General settings form (store_name, store_email, store_phone, store_address)
- ✅ Logo upload
- ✅ Payment/Shipping placeholders

**Cần kiểm tra:**
- [ ] Header buttons ("Hủy bỏ", "Lưu thay đổi") - chưa có
- [ ] Logo upload với circular border-dashed và preview - cần verify styling
- [ ] Payment methods section với toggle switches (COD, Bank Transfer, Momo) - chưa có
- [ ] Shipping settings với "Phí vận chuyển mặc định", "Miễn phí vận chuyển cho đơn từ", "Đối tác vận chuyển" checkboxes - chưa có
- [ ] Section headers với icons (storefront, payments, local_shipping) - cần verify

---

## 🎯 Ưu Tiên Cập Nhật

### High Priority (User-facing pages)
1. **Home Page** - Thiếu Categories và Best Sellers sections
2. **Product Detail** - Cần verify layout match
3. **Cart** - Cần verify table layout
4. **Checkout** - Cần verify form layout
5. **Payment** - Cần verify payment method selection

### Medium Priority
6. **Orders/OrderDetail** - Cần verify timeline và layout
7. **Profile** - Cần verify sidebar và forms
8. **Categories** - Cần verify grid layout
9. **Search** - Cần verify search UI

### Low Priority
10. **Auth Pages** - Cần verify forms
11. **Static Pages** - Cần verify content
12. **Admin Pages** - Cần verify admin UI

---

## 📝 Notes

- Tất cả các trang cần match về:
  - Layout structure và spacing
  - Color scheme (primary, background, text colors)
  - Typography (font sizes, weights, line heights)
  - Component styles (buttons, inputs, cards, tables)
  - Dark mode support
  - Responsive design (mobile, tablet, desktop)
  - Hover effects và transitions
  - Icons và Material Symbols usage

- Các components chung cần verify:
  - Header/Navigation
  - Footer
  - Breadcrumb
  - Buttons
  - Inputs
  - Cards
  - Tables
  - Modals/Dialogs

---

*Last Updated: [Date]*

