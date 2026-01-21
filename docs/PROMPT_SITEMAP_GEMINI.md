# PROMPT ĐỂ TẠO SƠ ĐỒ SITEMAP CHO GEMINI

## Prompt chính:

Hãy tạo sơ đồ sitemap (sơ đồ cây trang web) cho website thương mại điện tử YORI Fashion với các yêu cầu sau:

### Thông tin về website:
- Tên: YORI Fashion - Website thương mại điện tử thời trang
- Loại: E-commerce platform với 3 nhóm người dùng: Khách vãng lai (Public), Khách hàng đã đăng nhập (Protected), Quản trị viên (Admin)

### Cấu trúc routes và pages:

#### 1. PUBLIC ROUTES (Không cần đăng nhập):
- / (Trang chủ - Home)
- /login (Đăng nhập)
- /signup (Đăng ký)
- /forgot-password (Quên mật khẩu)
- /reset-password (Đặt lại mật khẩu)
- /products (Danh sách sản phẩm)
- /products/:slug (Chi tiết sản phẩm)
- /categories (Danh mục sản phẩm)
- /search (Tìm kiếm sản phẩm)
- /about (Giới thiệu)
- /contact (Liên hệ)
- /terms (Điều khoản)
- /size-guide (Hướng dẫn chọn size)
- /404 (Trang không tìm thấy)
- /500 (Lỗi server)

#### 2. PROTECTED ROUTES (Cần đăng nhập):
- /cart (Giỏ hàng)
- /checkout (Thanh toán - Bước 1: Thông tin giao hàng)
- /checkout/payment (Thanh toán - Bước 2: Phương thức thanh toán)
- /orders (Danh sách đơn hàng)
- /orders/:orderId (Chi tiết đơn hàng)
- /orders/:orderId/success (Đặt hàng thành công)
- /profile (Thông tin cá nhân)

#### 3. ADMIN ROUTES (Cần đăng nhập + quyền admin):
- /admin hoặc /admin/dashboard (Dashboard quản trị)
- /admin/products (Quản lý sản phẩm)
- /admin/orders (Quản lý đơn hàng)
- /admin/customers (Quản lý khách hàng)
- /admin/reviews (Quản lý đánh giá)
- /admin/settings (Cài đặt hệ thống)

### Yêu cầu về sơ đồ:

1. **Format**: Tạo sơ đồ dạng cây (tree structure) với các ký tự ASCII hoặc sử dụng Mermaid diagram syntax

2. **Phân loại màu/ký hiệu**:
   - Public routes: Màu xanh lá hoặc ký hiệu [P]
   - Protected routes: Màu vàng/cam hoặc ký hiệu [🔒]
   - Admin routes: Màu đỏ hoặc ký hiệu [👑]

3. **Cấu trúc phân cấp**:
   - Root: YORI Fashion Website
   - Level 1: Nhóm routes (Public, Protected, Admin)
   - Level 2: Các routes chính
   - Level 3: Sub-routes (nếu có)

4. **Bao gồm**:
   - Tên route
   - Đường dẫn URL
   - Mô tả ngắn gọn chức năng (tiếng Việt)
   - Ký hiệu phân loại

5. **Output format**: 
   - Tạo cả 2 phiên bản:
     a) Text-based tree với ASCII art
     b) Mermaid diagram code (để có thể render trên GitHub hoặc các tool hỗ trợ Mermaid)

### Ví dụ format mong muốn:

```
YORI Fashion Website
│
├── 📱 PUBLIC ROUTES [P]
│   ├── / (Trang chủ)
│   ├── /login (Đăng nhập)
│   ├── /signup (Đăng ký)
│   ├── /products (Danh sách sản phẩm)
│   │   └── /products/:slug (Chi tiết sản phẩm)
│   └── ...
│
├── 🔒 PROTECTED ROUTES [🔒]
│   ├── /cart (Giỏ hàng)
│   ├── /checkout (Thanh toán)
│   │   └── /checkout/payment (Phương thức thanh toán)
│   └── ...
│
└── 👑 ADMIN ROUTES [👑]
    ├── /admin/dashboard (Dashboard)
    ├── /admin/products (Quản lý sản phẩm)
    └── ...
```

Hãy tạo sơ đồ sitemap chi tiết và đầy đủ theo yêu cầu trên.

