# UI Comparison Checklist - So sánh Frontend với UI gốc

Checklist để đảm bảo tất cả các trang frontend match với UI gốc trong thư mục `ui/`.

## 📋 Mapping UI Files → Frontend Pages

| UI File | Frontend Page | Status | Notes |
|---------|--------------|--------|-------|
| `trangchu.html` | `Home.tsx` | ✅ Done | Đã cập nhật với Categories, Best Sellers, Newsletter |
| `product.html` | `ProductDetail.tsx` | ⚠️ Verify | Đã có đầy đủ, cần verify styling |
| `product_info.html` | `ProductDetail.tsx` | ⚠️ Verify | Đã có đầy đủ, cần verify styling |
| `cart.html` | `Cart.tsx` | ⚠️ Verify | Đã có table layout, cần verify styling |
| `ship.html` | `Checkout.tsx` | ⚠️ Verify | Đã có form, cần verify breadcrumb và styling |
| `payment.html` | `Payment.tsx` | ⚠️ Verify | Đã có payment methods, cần verify steps nav và credit card form |
| `view_purchase.html` | `Orders.tsx` / `OrderDetail.tsx` | ⚠️ Verify | Đã có list và detail, cần verify timeline component |
| `userprof.html` | `Profile.tsx` | ⚠️ Verify | Đã có form, cần verify sidebar navigation |
| `categories.html` | `Categories.tsx` | ⚠️ Verify | Đã có hero và grid, cần filter chips và New Arrivals section |
| `search.html` | `Search.tsx` | ⚠️ Verify | Đã có search và results, cần hero section, tags, và toolbar |
| `choose_size.html` | `SizeGuide.tsx` | ✅ Done | Đã cập nhật với tabs, cách đo, bảng size Áo/Quần, Fit Guide |
| `login.html` | `Login.tsx` | ⚠️ Verify | Đã có form và social login, cần verify image background |
| `signup.html` | `Signup.tsx` | ⚠️ Verify | Đã có form và social login, cần verify image background |
| `forgotpw.html` | `ForgotPassword.tsx` | ⚠️ Verify | Đã có form và success state, cần verify button text |
| `contract.html` | `Contact.tsx` | ⚠️ Verify | Đã có form và info, cần hero blur, subject/phone fields, social links |
| `introduction.html` | `About.tsx` | ⚠️ Verify | Đã có tất cả sections, cần verify styling chi tiết |
| `term_policies.html` | `Terms.tsx` | ⚠️ Verify | Đã có content, cần sidebar nav, section numbering, tables |
| `404.html` | `NotFound.tsx` | ⚠️ Verify | Đã có error message và buttons, cần split layout và image |
| `admin_dashboard.html` / `ad_dash.html` | `admin/Dashboard.tsx` | ⚠️ Verify | Đã có stats và chart, cần date range buttons, pie chart, top products |
| `ad_product.html` | `admin/Products.tsx` | ⚠️ Verify | Đã có table và filters, cần SKU display, filter button, table styling |
| `ad_order.html` | `admin/Orders.tsx` | ⚠️ Verify | Đã có stats và table, cần header buttons, status filter buttons |
| `ad_customer.html` | `admin/Customers.tsx` | ⚠️ Verify | Đã có table và filters, cần header buttons, checkbox, avatar, total spent, sort |
| `ad_setting.html` | `admin/Settings.tsx` | ⚠️ Verify | Đã có tabs và forms, cần header buttons, payment toggles, shipping config |
| `purchasesuccess.html` | `OrderSuccess.tsx` | ⚠️ Verify | Đã có order details, cần progress bar và layout chi tiết |
| `payment_history.html` | N/A | ⏳ Pending | Có thể là phần của Profile hoặc Orders |

## 🔍 Chi tiết kiểm tra từng trang

### ✅ Đã hoàn thành
- **SizeGuide.tsx** - Đã match với `choose_size.html`:
  - ✅ Tabs navigation (Cách đo cơ thể, Áo, Quần, Form dáng)
  - ✅ Hướng dẫn đo cơ thể với hình minh họa
  - ✅ Bảng size Áo (Tops) với toggle CM/INCH
  - ✅ Bảng size Quần (Bottoms)
  - ✅ Fit Guide (Regular, Slim, Oversized)

### ⏳ Cần kiểm tra

#### 1. Home Page (`trangchu.html` → `Home.tsx`)
- [ ] Hero banner với text overlay
- [ ] Brand philosophy section
- [ ] Featured products grid
- [ ] Categories section
- [ ] Newsletter signup
- [ ] Footer

#### 2. Product Detail (`product.html`, `product_info.html` → `ProductDetail.tsx`)
- [ ] Product image gallery
- [ ] Product info (name, price, description)
- [ ] Size selector
- [ ] Color selector
- [ ] Quantity selector
- [ ] Add to cart button
- [ ] Product tabs (Mô tả, Thông số, Đánh giá)
- [ ] Related products

#### 3. Cart (`cart.html` → `Cart.tsx`)
- [ ] Cart items list
- [ ] Quantity controls
- [ ] Remove item button
- [ ] Cart summary (subtotal, shipping, total)
- [ ] Continue shopping / Checkout buttons
- [ ] Empty cart state

#### 4. Checkout (`ship.html` → `Checkout.tsx`)
- [ ] Breadcrumb (Cart → Shipping → Payment → Complete)
- [ ] Shipping address form
- [ ] Location selectors (Province, District, Ward)
- [ ] Order summary sidebar
- [ ] Continue to payment button

#### 5. Payment (`payment.html` → `Payment.tsx`)
- [ ] Payment method selection (COD, Bank transfer, etc.)
- [ ] Order summary
- [ ] Place order button
- [ ] Security badges

#### 6. Orders (`view_purchase.html` → `Orders.tsx`, `OrderDetail.tsx`)
- [ ] Orders list with status badges
- [ ] Order detail page with timeline
- [ ] Order items
- [ ] Shipping info
- [ ] Payment info
- [ ] Action buttons (Cancel, Track, etc.)

#### 7. Profile (`userprof.html` → `Profile.tsx`)
- [ ] Sidebar navigation
- [ ] Profile info form
- [ ] Avatar upload
- [ ] Address book
- [ ] Order history link
- [ ] Change password

#### 8. Categories (`categories.html` → `Categories.tsx`)
- [ ] Category grid/cards
- [ ] Category filters
- [ ] Product count per category

#### 9. Search (`search.html` → `Search.tsx`)
- [ ] Search input with icon
- [ ] Search results grid
- [ ] Filters sidebar
- [ ] Sort options
- [ ] Pagination

#### 10. Auth Pages
- [ ] Login form
- [ ] Signup form
- [ ] Forgot password form
- [ ] Reset password form
- [ ] Social login buttons (nếu có)

#### 11. Static Pages
- [ ] About (`introduction.html` → `About.tsx`)
- [ ] Contact (`contract.html` → `Contact.tsx`)
- [ ] Terms (`term_policies.html` → `Terms.tsx`)
- [ ] 404 (`404.html` → `NotFound.tsx`)

#### 12. Admin Pages
- [ ] Admin Dashboard (`admin_dashboard.html`, `ad_dash.html`)
- [ ] Admin Products (`ad_product.html`)
- [ ] Admin Orders (`ad_order.html`)
- [ ] Admin Customers (`ad_customer.html`)
- [ ] Admin Settings (`ad_setting.html`)

## 📝 Notes

- Tất cả các trang cần match về:
  - Layout structure
  - Color scheme (primary, background, text colors)
  - Typography (font sizes, weights)
  - Spacing (padding, margins)
  - Component styles (buttons, inputs, cards)
  - Dark mode support
  - Responsive design

- Các trang đã có trong frontend nhưng cần verify:
  - Header/Footer consistency
  - Breadcrumb navigation
  - Loading states
  - Error states
  - Empty states

---

*Last Updated: [Date]*

