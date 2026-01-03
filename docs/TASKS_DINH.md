# 📋 Công Việc của Đỉnh - Product & Search Pages

## 👤 Thông Tin
- **Người phụ trách**: Đỉnh
- **Nhóm trang**: Product & Search
- **Số trang**: 4 trang
- **Mức độ**: Medium-High

---

## 📄 Danh Sách Trang Cần Làm

### 1. ProductDetail.tsx
- **UI File**: `ui/product.html`, `ui/product_info.html`
- **File hiện tại**: `fe/src/pages/ProductDetail.tsx`
- **Status**: ✅ DONE - Styling match 100%, responsive, dark mode supported

### 2. Products.tsx
- **UI File**: `ui/product.html` (list view)
- **File hiện tại**: `fe/src/pages/Products.tsx`
- **Status**: ✅ DONE - Styling match 100%, responsive, dark mode supported

### 3. Categories.tsx
- **UI File**: `ui/categories.html`
- **File hiện tại**: `fe/src/pages/Categories.tsx`
- **Status**: ✅ DONE - Styling match 100%, responsive, dark mode supported

### 4. Search.tsx
- **UI File**: `ui/search.html`
- **File hiện tại**: `fe/src/pages/Search.tsx`
- **Status**: ✅ DONE - Styling match 100%, responsive, dark mode supported

---

## ✅ Checklist Chi Tiết

### 1. ProductDetail.tsx

#### Đã có:
- ✅ Product image gallery
- ✅ Product info (name, price, description)
- ✅ Size selector
- ✅ Color selector
- ✅ Quantity selector
- ✅ Add to cart button
- ✅ Related products section

#### Cần làm:
- [x] **So sánh với `ui/product_info.html`:**
  - [x] Image gallery layout và styling (grid, thumbnails)
  - [x] Product name font size và weight
  - [x] Price display format (giá gốc, giá khuyến mãi)
  - [x] Description text styling
  - [x] Size selector buttons styling (active state)
  - [x] Color selector với color swatches
  - [x] Quantity input với +/- buttons
  - [x] Add to cart button styling
  - [x] Product info badges (shipping, return, verified)
  - [x] Related products grid layout
  - [x] Spacing và padding match UI

- [x] **Kiểm tra responsive:**
  - [x] Mobile layout (image gallery trên, info dưới)
  - [x] Tablet layout
  - [x] Desktop layout

- [x] **Dark mode:**
  - [x] Tất cả colors match dark mode theme
  - [x] Borders và backgrounds

#### File cần xem:
- `ui/product_info.html` - Reference UI
- `fe/src/pages/ProductDetail.tsx` - File cần update
- `fe/src/components/product/` - Components liên quan

---

### 2. Products.tsx

#### Đã có:
- ✅ Products list/grid
- ✅ Pagination
- ✅ Filters (có thể)

#### Cần làm:
- [x] **So sánh với `ui/product.html` (list view):**
  - [x] Grid/List toggle (nếu có)
  - [x] Product card layout
  - [x] Filter sidebar (nếu có)
  - [x] Sort dropdown
  - [x] Pagination styling
  - [x] Empty state

- [x] **Kiểm tra responsive:**
  - [x] Mobile: 1-2 columns
  - [x] Tablet: 2-3 columns
  - [x] Desktop: 4 columns

#### File cần xem:
- `ui/product.html` - Reference UI
- `fe/src/pages/Products.tsx` - File cần update

---

### 3. Categories.tsx

#### Đã có:
- ✅ Hero section với heading và description
- ✅ Categories grid
- ✅ Filter chips (Tất cả, Hàng mới, Bán chạy, Cơ bản)
- ✅ New Arrivals section

#### Cần làm:
- [x] **So sánh với `ui/categories.html`:**
  - [x] Hero section styling (background, text overlay)
  - [x] Filter chips (Tất cả, Áo, Quần, etc.)
  - [x] "New Arrivals" section (nếu có)
  - [x] Category card layout
  - [x] Category image aspect ratio
  - [x] Hover effects
  - [x] Product count per category

- [x] **Kiểm tra responsive:**
  - [x] Mobile: 1-2 columns
  - [x] Tablet: 2-3 columns
  - [x] Desktop: 3-4 columns

#### File cần xem:
- `ui/categories.html` - Reference UI
- `fe/src/pages/Categories.tsx` - File cần update

---

### 4. Search.tsx

#### Đã có:
- ✅ Search input
- ✅ Search results grid
- ✅ Pagination
- ✅ Hero section với search input lớn
- ✅ Search tags/suggestions
- ✅ Toolbar (sort, filter)

#### Cần làm:
- [x] **So sánh với `ui/search.html`:**
  - [x] Hero section với search input lớn
  - [x] Search tags/suggestions (nếu có)
  - [x] Toolbar (sort, filter, view toggle)
  - [x] Results grid layout
  - [x] Empty state ("Không tìm thấy sản phẩm")
  - [x] Loading state

- [x] **Kiểm tra responsive:**
  - [x] Mobile search input
  - [x] Results grid responsive

#### File cần xem:
- `ui/search.html` - Reference UI
- `fe/src/pages/Search.tsx` - File cần update

---

## 🎯 Mục Tiêu

1. **Styling Match**: Tất cả styling phải match 100% với UI gốc
2. **Responsive**: Hoạt động tốt trên mobile, tablet, desktop
3. **Dark Mode**: Hỗ trợ dark mode đầy đủ
4. **Functionality**: Đảm bảo tất cả tính năng hoạt động (filter, sort, pagination)

---

## 🔧 Công Cụ & Resources

### Files Reference
- UI Files: `ui/product.html`, `ui/product_info.html`, `ui/categories.html`, `ui/search.html`
- Frontend Files: `fe/src/pages/ProductDetail.tsx`, `fe/src/pages/Products.tsx`, `fe/src/pages/Categories.tsx`, `fe/src/pages/Search.tsx`
- Components: `fe/src/components/product/`, `fe/src/components/common/`

### API Endpoints
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:slug` - Product detail
- `GET /api/v1/products/:slug/related` - Related products
- `GET /api/v1/categories` - List categories

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển
- [API Documentation](./API_DOCUMENTATION.md) - API endpoints

---

## 📝 Notes

- **Làm việc độc lập**: Bạn có thể làm việc độc lập với các trang này, không cần phụ thuộc vào người khác
- **Commit message**: Sử dụng format `feat(dinh): update ProductDetail styling` hoặc `fix(dinh): fix Categories filter`
- **Testing**: Test trên mobile, tablet, desktop sau khi hoàn thành
- **Dark mode**: Luôn kiểm tra dark mode khi update styling

---

## ✅ Definition of Done

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động đúng
- [ ] Tất cả tính năng hoạt động (nếu có)
- [ ] Không có lỗi console
- [ ] Code đã được review (nếu có)

---

*Last Updated: 2024*

