# 📋 Công Việc của Trung - Auth & Static Pages

## 👤 Thông Tin
- **Người phụ trách**: Trung
- **Nhóm trang**: Auth & Static Pages
- **Số trang**: 6 trang
- **Mức độ**: Medium

---

## 📄 Danh Sách Trang Cần Làm

### 1. Login.tsx
- **UI File**: `ui/login.html`
- **File hiện tại**: `fe/src/pages/Login.tsx`
- **Status**: ⚠️ Verify - Cần verify image background

### 2. Signup.tsx
- **UI File**: `ui/signup.html`
- **File hiện tại**: `fe/src/pages/Signup.tsx`
- **Status**: ⚠️ Verify - Cần verify image background

### 3. ForgotPassword.tsx
- **UI File**: `ui/forgotpw.html`
- **File hiện tại**: `fe/src/pages/ForgotPassword.tsx`
- **Status**: ⚠️ Verify - Cần verify button text

### 4. Contact.tsx
- **UI File**: `ui/contract.html`
- **File hiện tại**: `fe/src/pages/Contact.tsx`
- **Status**: ⚠️ Verify - Cần hero blur, subject/phone fields, social links

### 5. About.tsx
- **UI File**: `ui/introduction.html`
- **File hiện tại**: `fe/src/pages/About.tsx`
- **Status**: ⚠️ Verify - Cần verify styling chi tiết

### 6. Terms.tsx
- **UI File**: `ui/term_policies.html`
- **File hiện tại**: `fe/src/pages/Terms.tsx`
- **Status**: ⚠️ Verify - Cần sidebar nav, section numbering, tables

### 7. NotFound.tsx (Bonus)
- **UI File**: `ui/404.html`
- **File hiện tại**: `fe/src/pages/NotFound.tsx`
- **Status**: ⚠️ Verify - Cần split layout và image

---

## ✅ Checklist Chi Tiết

### 1. Login.tsx

#### Đã có:
- ✅ Login form với email và password
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Social login buttons
- ✅ Toast notifications

#### Cần làm:
- [ ] **So sánh với `ui/login.html`:**
  - [ ] Image background section (bên trái hoặc phải)
  - [ ] Image URL và overlay
  - [ ] Form section layout
  - [ ] Input styling (`bg-[#f8fbfc]`, borders)
  - [ ] Button styling
  - [ ] Social login buttons styling
  - [ ] Link colors và hover effects
  - [ ] Spacing và padding

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Image ẩn hoặc background
  - [ ] Desktop: Split layout (form + image)

- [ ] **Dark mode:**
  - [ ] Form inputs
  - [ ] Backgrounds

#### File cần xem:
- `ui/login.html` - Reference UI
- `fe/src/pages/Login.tsx` - File cần update

---

### 2. Signup.tsx

#### Đã có:
- ✅ Registration form
- ✅ Terms agreement checkbox
- ✅ Social login buttons
- ✅ Toast notifications

#### Cần làm:
- [ ] **So sánh với `ui/signup.html`:**
  - [ ] Image background section
  - [ ] Image URL và overlay
  - [ ] Form section layout
  - [ ] Input fields styling
  - [ ] Password visibility toggle
  - [ ] Terms checkbox styling
  - [ ] Social login buttons
  - [ ] Spacing và padding

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Image ẩn hoặc background
  - [ ] Desktop: Split layout

- [ ] **Dark mode:**
  - [ ] Form inputs
  - [ ] Backgrounds

#### File cần xem:
- `ui/signup.html` - Reference UI
- `fe/src/pages/Signup.tsx` - File cần update

---

### 3. ForgotPassword.tsx

#### Đã có:
- ✅ Email input form
- ✅ Success state
- ✅ Links (back to login, resend)

#### Cần làm:
- [ ] **So sánh với `ui/forgotpw.html`:**
  - [ ] Centered form layout
  - [ ] Lock icon (material-symbols-outlined)
  - [ ] Heading và description
  - [ ] Email input styling
  - [ ] Submit button text ("Gửi email" vs "Gửi link")
  - [ ] Success state:
    - [ ] Check icon
    - [ ] Success message
    - [ ] "Kiểm tra email" instruction
  - [ ] Links styling (back to login, resend)

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Form full width
  - [ ] Desktop: Centered với max-width

- [ ] **Dark mode:**
  - [ ] Form inputs
  - [ ] Icons

#### File cần xem:
- `ui/forgotpw.html` - Reference UI
- `fe/src/pages/ForgotPassword.tsx` - File cần update

---

### 4. Contact.tsx

#### Đã có:
- ✅ Hero section
- ✅ Contact info
- ✅ Contact form

#### Cần làm:
- [ ] **So sánh với `ui/contract.html`:**
  - [ ] Hero section với blur effect (backdrop-blur)
  - [ ] Hero background image
  - [ ] Contact info cards:
    - [ ] Address
    - [ ] Phone
    - [ ] Email
    - [ ] Icons cho mỗi info
  - [ ] Contact form:
    - [ ] Name field
    - [ ] Email field
    - [ ] Phone field (nếu có)
    - [ ] Subject field (nếu có)
    - [ ] Message textarea
    - [ ] Submit button
  - [ ] Social media links (nếu có):
    - [ ] Facebook
    - [ ] Instagram
    - [ ] Twitter
    - [ ] Icons và links

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Info cards stack
  - [ ] Desktop: Info cards grid

- [ ] **Dark mode:**
  - [ ] Hero blur effect
  - [ ] Form inputs
  - [ ] Info cards

#### File cần xem:
- `ui/contract.html` - Reference UI
- `fe/src/pages/Contact.tsx` - File cần update

---

### 5. About.tsx

#### Đã có:
- ✅ Hero section
- ✅ Philosophy section
- ✅ Origin section
- ✅ Values section
- ✅ Craftsmanship section
- ✅ Quote section

#### Cần làm:
- [ ] **So sánh với `ui/introduction.html`:**
  - [ ] Hero section styling
  - [ ] Section spacing và padding
  - [ ] Typography (headings, paragraphs)
  - [ ] Image placements và sizes
  - [ ] Background colors
  - [ ] Card layouts
  - [ ] Quote section styling

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Sections stack
  - [ ] Desktop: Grid layouts

- [ ] **Dark mode:**
  - [ ] Text colors
  - [ ] Background colors
  - [ ] Borders

#### File cần xem:
- `ui/introduction.html` - Reference UI
- `fe/src/pages/About.tsx` - File cần update

---

### 6. Terms.tsx

#### Đã có:
- ✅ Hero section
- ✅ Content sections

#### Cần làm:
- [ ] **So sánh với `ui/term_policies.html`:**
  - [ ] Sidebar navigation (sticky):
    - [ ] Table of contents
    - [ ] Links đến các sections
    - [ ] Active section highlight
  - [ ] Main content:
    - [ ] Section numbering (1., 2., 3., etc.)
    - [ ] Heading hierarchy
    - [ ] Tables (nếu có)
    - [ ] Lists (ordered, unordered)
    - [ ] Text formatting (bold, italic, links)
  - [ ] Scroll spy (highlight section khi scroll)

- [ ] **Sidebar Component:**
  - [ ] Tạo component `TermsSidebar.tsx` hoặc dùng component chung
  - [ ] Sticky positioning
  - [ ] Active state khi scroll

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Sidebar ẩn hoặc bottom nav
  - [ ] Desktop: Sidebar left, content right

- [ ] **Dark mode:**
  - [ ] Sidebar background
  - [ ] Text colors
  - [ ] Tables

#### File cần xem:
- `ui/term_policies.html` - Reference UI
- `fe/src/pages/Terms.tsx` - File cần update

---

### 7. NotFound.tsx (Bonus)

#### Đã có:
- ✅ 404 heading
- ✅ Error message
- ✅ Buttons

#### Cần làm:
- [ ] **So sánh với `ui/404.html`:**
  - [ ] Split layout (text left, image right)
  - [ ] 404 number styling (large, bold)
  - [ ] Error message
  - [ ] Image (illustration hoặc photo)
  - [ ] Action buttons:
    - [ ] "Về trang chủ"
    - [ ] "Quay lại"
  - [ ] Background colors

- [ ] **Kiểm tra responsive:**
  - [ ] Mobile: Stack vertically
  - [ ] Desktop: Split layout

- [ ] **Dark mode:**
  - [ ] Background colors
  - [ ] Text colors

#### File cần xem:
- `ui/404.html` - Reference UI
- `fe/src/pages/NotFound.tsx` - File cần update

---

## 🎯 Mục Tiêu

1. **Auth Pages**: Đảm bảo UX tốt cho login/signup flow
2. **Static Pages**: Content pages đẹp và dễ đọc
3. **Styling Match**: Tất cả styling match 100% với UI gốc
4. **Components Reusable**: Tạo components có thể reuse (Sidebar, etc.)

---

## 🔧 Công Cụ & Resources

### Files Reference
- UI Files: `ui/login.html`, `ui/signup.html`, `ui/forgotpw.html`, `ui/contract.html`, `ui/introduction.html`, `ui/term_policies.html`, `ui/404.html`
- Frontend Files: `fe/src/pages/Login.tsx`, `fe/src/pages/Signup.tsx`, `fe/src/pages/ForgotPassword.tsx`, `fe/src/pages/Contact.tsx`, `fe/src/pages/About.tsx`, `fe/src/pages/Terms.tsx`, `fe/src/pages/NotFound.tsx`

### API Endpoints
- `POST /api/v1/users/login` - Login
- `POST /api/v1/users/register` - Register
- `POST /api/v1/users/forgot-password` - Forgot password
- `POST /api/v1/users/reset-password` - Reset password
- `POST /api/v1/contact/submit` - Submit contact form

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển

---

## 📝 Notes

- **Auth Flow**: Đảm bảo flow Login → Signup → Forgot Password mượt mà
- **Form Validation**: Tất cả forms đã có validation, chỉ cần verify UI
- **Toast Notifications**: Đã được implement, chỉ cần verify hiển thị
- **Sidebar Navigation**: Có thể tạo component chung cho Terms và Profile

---

## ✅ Definition of Done

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices
- [ ] Dark mode hoạt động đúng
- [ ] Forms có validation và error handling
- [ ] Toast notifications hoạt động
- [ ] Không có lỗi console

---

*Last Updated: 2024*

