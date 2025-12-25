# 📋 Công Việc của Tuấn Anh - Home & Misc Pages

## 👤 Thông Tin
- **Người phụ trách**: Tuấn Anh
- **Nhóm trang**: Home & Misc Pages
- **Số trang**: 2-3 trang (Home đã done, có thể thêm Error500)
- **Mức độ**: Low-Medium

---

## 📄 Danh Sách Trang Cần Làm

### 1. Home.tsx ✅ (Đã hoàn thành - Cần verify)
- **UI File**: `ui/trangchu.html`
- **File hiện tại**: `fe/src/pages/Home.tsx`
- **Status**: ✅ Done - Cần final verification

### 2. SizeGuide.tsx ✅ (Đã hoàn thành - Cần verify)
- **UI File**: `ui/choose_size.html`
- **File hiện tại**: `fe/src/pages/SizeGuide.tsx`
- **Status**: ✅ Done - Cần final verification

### 3. Error500.tsx (Bonus - Nếu có thời gian)
- **File hiện tại**: `fe/src/pages/Error500.tsx`
- **Status**: ⏳ Optional - Có thể tạo nếu cần

---

## ✅ Checklist Chi Tiết

### 1. Home.tsx - Final Verification

#### Đã có:
- ✅ Hero banner với carousel
- ✅ Brand Philosophy section
- ✅ Featured Products section
- ✅ Categories Section (3 cards)
- ✅ Best Sellers Section
- ✅ Newsletter Section

#### Cần verify:
- [ ] **So sánh lại với `ui/trangchu.html`:**
  - [ ] Hero banner:
    - [ ] Carousel/slider hoạt động
    - [ ] Text overlay positioning
    - [ ] Navigation arrows/dots
  - [ ] Brand Philosophy:
    - [ ] Text content match 100%
    - [ ] Typography (font sizes, weights)
    - [ ] Spacing và padding
  - [ ] Featured Products:
    - [ ] Grid layout (4 columns desktop)
    - [ ] "Xem tất cả" link ở header
    - [ ] Product card styling
    - [ ] Hover effects
  - [ ] Categories Section:
    - [ ] 3 cards layout
    - [ ] Category images
    - [ ] Category names
    - [ ] Hover effects
  - [ ] Best Sellers:
    - [ ] "Bán chạy nhất tuần" heading
    - [ ] Grid 4 columns
    - [ ] Product cards với "Thêm vào giỏ" button
  - [ ] Newsletter:
    - [ ] Email input
    - [ ] Submit button
    - [ ] Success/error states

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Sections stack, grid 1-2 columns
  - [ ] Tablet: Grid 2-3 columns
  - [ ] Desktop: Grid 4 columns

- [ ] **Dark mode:**
  - [ ] Tất cả sections
  - [ ] Text colors
  - [ ] Background colors

- [ ] **Performance:**
  - [ ] Images lazy loading
  - [ ] Smooth scrolling
  - [ ] No layout shift

#### File cần xem:
- `ui/trangchu.html` - Reference UI
- `fe/src/pages/Home.tsx` - File cần verify

---

### 2. SizeGuide.tsx - Final Verification

#### Đã có:
- ✅ Tabs navigation (4 tabs)
- ✅ Section "Cách đo cơ thể"
- ✅ Bảng size Áo (Tops)
- ✅ Bảng size Quần (Bottoms)
- ✅ Fit Guide

#### Cần verify:
- [ ] **So sánh lại với `ui/choose_size.html`:**
  - [ ] Tabs navigation:
    - [ ] Active state styling
    - [ ] Hover effects
    - [ ] Border bottom active indicator
  - [ ] "Cách đo cơ thể" section:
    - [ ] Background image
    - [ ] Numbered instructions (1, 2, 3)
    - [ ] Text content match
    - [ ] Note box styling
  - [ ] Bảng size Áo:
    - [ ] Table header styling
    - [ ] Toggle CM/INCH (nếu có)
    - [ ] Data match 100%
    - [ ] Hover effects
  - [ ] Bảng size Quần:
    - [ ] Table header styling
    - [ ] Data match 100%
    - [ ] Hover effects
  - [ ] Fit Guide:
    - [ ] 3 cards layout
    - [ ] Icons (material-symbols-outlined)
    - [ ] Card styling
    - [ ] Hover effects

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Tables scroll horizontal
  - [ ] Desktop: Full width

- [ ] **Dark mode:**
  - [ ] Tables
  - [ ] Cards
  - [ ] Text colors

#### File cần xem:
- `ui/choose_size.html` - Reference UI
- `fe/src/pages/SizeGuide.tsx` - File cần verify

---

### 3. Error500.tsx (Optional)

#### Cần làm (nếu có thời gian):
- [ ] **Tạo Error 500 page:**
  - [ ] Error message
  - [ ] Illustration hoặc icon
  - [ ] Action buttons:
    - [ ] "Thử lại"
    - [ ] "Về trang chủ"
  - [ ] Styling match với NotFound.tsx

#### File cần xem:
- `fe/src/pages/NotFound.tsx` - Reference styling
- `fe/src/pages/Error500.tsx` - File cần tạo/update

---

## 🎯 Mục Tiêu

1. **Final Polish**: Đảm bảo Home và SizeGuide hoàn hảo 100%
2. **Performance**: Tối ưu performance cho Home page
3. **User Experience**: Đảm bảo UX tốt nhất cho landing page

---

## 🔧 Công Cụ & Resources

### Files Reference
- UI Files: `ui/trangchu.html`, `ui/choose_size.html`
- Frontend Files: `fe/src/pages/Home.tsx`, `fe/src/pages/SizeGuide.tsx`
- Components: `fe/src/components/common/`, `fe/src/components/product/`

### API Endpoints
- `GET /api/v1/banners` - Get banners
- `GET /api/v1/products?is_featured=true` - Featured products
- `GET /api/v1/products?sort_by=sold&limit=4` - Best sellers
- `GET /api/v1/categories?is_featured=true&limit=3` - Featured categories

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển

---

## 📝 Notes

- **Home Page**: Đây là trang quan trọng nhất, cần verify kỹ
- **Performance**: Home page cần load nhanh, optimize images
- **SEO**: Đảm bảo meta tags và structured data (nếu có)

---

## ✅ Definition of Done

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động đúng
- [ ] Performance tốt (lazy loading, optimized images)
- [ ] Tất cả API calls hoạt động
- [ ] Không có lỗi console
- [ ] Final review và approval

---

## 🎁 Bonus Tasks (Nếu có thời gian)

- [ ] Tối ưu performance Home page
- [ ] Thêm animations và transitions
- [ ] Tạo Error500 page
- [ ] Improve SEO (meta tags, structured data)
- [ ] Add loading states improvements

---

*Last Updated: 2024*
