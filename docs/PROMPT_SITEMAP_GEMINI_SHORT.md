# PROMPT NGẮN GỌN - COPY VÀO GEMINI

Hãy tạo sơ đồ sitemap cho website thương mại điện tử YORI Fashion với cấu trúc sau:

**PUBLIC ROUTES (Không cần đăng nhập):**
- / (Trang chủ)
- /login, /signup, /forgot-password, /reset-password (Xác thực)
- /products, /products/:slug (Sản phẩm)
- /categories, /search (Tìm kiếm & Danh mục)
- /about, /contact, /terms, /size-guide (Thông tin)

**PROTECTED ROUTES (Cần đăng nhập):**
- /cart (Giỏ hàng)
- /checkout, /checkout/payment (Thanh toán)
- /orders, /orders/:orderId, /orders/:orderId/success (Đơn hàng)
- /profile (Hồ sơ)

**ADMIN ROUTES (Cần quyền admin):**
- /admin/dashboard (Dashboard)
- /admin/products (Quản lý sản phẩm)
- /admin/orders (Quản lý đơn hàng)
- /admin/customers (Quản lý khách hàng)
- /admin/reviews (Quản lý đánh giá)
- /admin/settings (Cài đặt)

**Yêu cầu:**
1. Tạo sơ đồ dạng cây (tree structure) với ASCII art
2. Phân biệt 3 nhóm routes bằng ký hiệu: [P] Public, [🔒] Protected, [👑] Admin
3. Hiển thị đầy đủ đường dẫn và mô tả ngắn gọn
4. Tạo cả phiên bản Mermaid diagram code

Hãy tạo sơ đồ sitemap chi tiết và đẹp mắt.

