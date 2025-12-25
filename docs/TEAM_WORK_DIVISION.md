# 👥 Phân Công Công Việc - YORI Fashion Team

## 📊 Tổng Quan

**Team Size**: 6 người
**Tổng số trang**: 25-27 trang
**Phân chia**: ~4-5 trang mỗi người

---

## 👤 Phân Công Chi Tiết

### 1. Đỉnh - Product & Search Pages (4 trang)
**File task**: [TASKS_DINH.md](./TASKS_DINH.md)

- ✅ ProductDetail.tsx
- ✅ Products.tsx
- ✅ Categories.tsx
- ✅ Search.tsx

**Mức độ**: Medium-High
**Focus**: Product browsing và search experience

---

### 2. Hướng - Cart & Checkout Flow (4 trang)
**File task**: [TASKS_HUONG.md](./TASKS_HUONG.md)

- ✅ Cart.tsx
- ✅ Checkout.tsx
- ✅ Payment.tsx
- ✅ OrderSuccess.tsx

**Mức độ**: High (Critical user flow)
**Focus**: Shopping cart và checkout process

---

### 3. Tuấn - Orders & Profile Pages (3 trang)
**File task**: [TASKS_TUAN.md](./TASKS_TUAN.md)

- ✅ Orders.tsx
- ✅ OrderDetail.tsx
- ✅ Profile.tsx

**Mức độ**: Medium-High
**Focus**: Order management và user profile

---

### 4. Trung - Auth & Static Pages (6-7 trang)
**File task**: [TASKS_TRUNG.md](./TASKS_TRUNG.md)

- ✅ Login.tsx
- ✅ Signup.tsx
- ✅ ForgotPassword.tsx
- ✅ Contact.tsx
- ✅ About.tsx
- ✅ Terms.tsx
- ✅ NotFound.tsx (Bonus)

**Mức độ**: Medium
**Focus**: Authentication và content pages

---

### 5. Tuấn Anh - Home & Misc Pages (2-3 trang)
**File task**: [TASKS_TUAN_ANH.md](./TASKS_TUAN_ANH.md)

- ✅ Home.tsx (Đã done - cần verify)
- ✅ SizeGuide.tsx (Đã done - cần verify)
- ✅ Error500.tsx (Optional)

**Mức độ**: Low-Medium
**Focus**: Landing page và final polish

---

### 6. Khoa - Admin Pages (5 trang)
**File task**: [TASKS_KHOA.md](./TASKS_KHOA.md)

- ✅ Admin Dashboard.tsx
- ✅ Admin Products.tsx
- ✅ Admin Orders.tsx
- ✅ Admin Customers.tsx
- ✅ Admin Settings.tsx

**Mức độ**: High (Admin functionality)
**Focus**: Admin dashboard và management

---

## 📋 Workflow

### 1. Setup
1. Mỗi người đọc file task của mình: `docs/TASKS_[TEN].md`
2. Review UI files trong `ui/` folder
3. Review frontend files hiện tại trong `fe/src/pages/`

### 2. Development
1. Làm việc độc lập trên các trang được phân công
2. Update checklist trong file task của mình
3. Commit với message format: `feat([ten]): update [page] styling`

### 3. Testing
1. Test trên mobile, tablet, desktop
2. Test dark mode
3. Test tất cả tính năng
4. Check console errors

### 4. Review
1. Self-review checklist
2. Peer review (nếu có)
3. Final verification với UI gốc

---

## 🔄 Dependencies

### Không có dependencies (Làm việc độc lập)
- ✅ Đỉnh: Product pages - độc lập
- ✅ Hướng: Cart & Checkout - độc lập
- ✅ Tuấn: Orders & Profile - độc lập
- ✅ Trung: Auth & Static - độc lập
- ✅ Tuấn Anh: Home & Misc - độc lập
- ✅ Khoa: Admin pages - độc lập

### Shared Components (Cần coordinate nếu tạo mới)
- `Header.tsx` - Dùng chung
- `Footer.tsx` - Dùng chung
- `AdminLayout.tsx` - Dùng chung (Khoa)
- `Toast` - Dùng chung (đã có)
- `Button`, `Input`, `Select` - Dùng chung (đã có)

---

## 📝 Communication

### Daily Standup (Nếu có)
- Progress update
- Blockers
- Help needed

### Code Review
- Review checklist trong file task
- Verify với UI gốc
- Test functionality

---

## ✅ Definition of Done (Chung)

Một trang được coi là hoàn thành khi:
- [ ] Styling match 100% với UI gốc
- [ ] Responsive trên tất cả devices (mobile, tablet, desktop)
- [ ] Dark mode hoạt động đúng
- [ ] Tất cả tính năng hoạt động (nếu có)
- [ ] API integration hoạt động (nếu có)
- [ ] Error handling đầy đủ
- [ ] Toast notifications hoạt động (nếu có)
- [ ] Không có lỗi console
- [ ] Code đã được self-review
- [ ] Checklist trong file task đã được update

---

## 🎯 Timeline (Gợi ý)

- **Week 1**: Setup, review UI files, start development
- **Week 2**: Continue development, testing
- **Week 3**: Final polish, review, bug fixes
- **Week 4**: Integration testing, final verification

---

## 📚 Resources

### Documentation
- [UI Comparison Report](./UI_COMPARISON_REPORT.md) - Chi tiết so sánh
- [Frontend Checklist](./FRONTEND_CHECKLIST.md) - Checklist phát triển
- [API Documentation](./API_DOCUMENTATION.md) - API endpoints

### UI Files
- Tất cả UI files trong `ui/` folder
- Reference khi cần verify styling

### Frontend Files
- Tất cả frontend files trong `fe/src/pages/`
- Components trong `fe/src/components/`

---

## 🚀 Getting Started

1. **Đọc file task của bạn**: `docs/TASKS_[TEN].md`
2. **Review UI files**: Xem các file HTML trong `ui/` folder
3. **Review frontend files**: Xem các file hiện tại trong `fe/src/pages/`
4. **Start coding**: Bắt đầu update styling và functionality
5. **Update checklist**: Update checklist trong file task của bạn
6. **Test**: Test kỹ trước khi mark done

---

## 💡 Tips

- **Làm việc độc lập**: Mỗi người có thể làm việc độc lập, không cần phụ thuộc
- **Reference UI**: Luôn mở UI file để so sánh khi code
- **Dark mode**: Luôn test dark mode khi update styling
- **Responsive**: Test trên nhiều screen sizes
- **Console**: Check console để tìm lỗi
- **Commit often**: Commit thường xuyên với message rõ ràng

---

*Last Updated: 2024*

