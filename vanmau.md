Website được phát triển dựa trên React framework kết hợp với Tailwind CSS để tạo
giao diện người dùng hiện đại và responsive:

4.1.4. Các kỹ thuật thiết kế

o Layout dùng thẻ <div> hay <table>?

Website sử dụng thẻ <div> làm cơ sở cho layout chính, dựa trên Flexbox và CSS Grid thông qua Tailwind CSS. Chỉ sử dụng thẻ <table> cho dữ liệu dạng bảng thực sự (bảng giỏ hàng, size guide, bảng quản trị), không dùng <table> cho mục đích layout.

o Kỹ thuật thiết kế (hình ảnh, danh sách, liên kết, bảng biểu, form, ...)

Hình ảnh: Sử dụng thẻ <img> với loading="lazy", alt cho accessibility, aspect ratio classes (aspect-square, aspect-[3/4]), hỗ trợ image gallery với thumbnail navigation, fallback UI khi lỗi.

Danh sách: Sử dụng <ul>, <ol> kết hợp với .map() để render danh sách động, styling với Tailwind classes.

Liên kết: Sử dụng component <Link> từ React Router cho client-side navigation, thẻ <a> cho external links, hỗ trợ breadcrumb navigation.

Bảng biểu: Sử dụng <table> cho bảng giỏ hàng, size guide, bảng quản trị. Styling với Tailwind: border-collapse, divide-y, responsive với overflow-x-auto.

Form: Sử dụng React Hook Form + Zod cho validation. Custom components: Input, Select, Button, Textarea. Validation real-time với error messages, hỗ trợ accessibility.

Các kỹ thuật khác:
• Icons: Material Symbols (Google Icons)
• Animations: Framer Motion cho page transitions, hover effects, loading states
• Responsive Design: Mobile-first, breakpoints sm:, md:, lg:, xl:, 2xl:

o Kỹ thuật khác (JavaScript, jQuery, Ajax, ...)

JavaScript Framework: React 18 với TypeScript, React Router v6 cho routing, Vite làm build tool.

HTTP Requests (Ajax):
• Axios với interceptors (tự động thêm JWT token, xử lý errors, refresh token)
• Không sử dụng jQuery, chỉ dùng vanilla JavaScript và React

State Management:
• React Context API: AuthContext, CartContext, ThemeContext, ToastContext
• Custom Hooks: useAuth(), useCart(), useTheme()

Form Handling: React Hook Form + Zod validation + @hookform/resolvers

Animations: Framer Motion cho page transitions, component animations, hover effects

Build Tools: Vite, TypeScript, ESLint, PostCSS, Tailwind CSS

o Phần nào là vùng Editable Region của template?

1. Thanh điều hướng/Header: Logo, menu navigation, search bar, icons (search, user, cart, dark mode, mobile menu), user dropdown menu.

2. Vùng nội dung chính: Nội dung động theo routes - Trang chủ (banners, categories, products), Sản phẩm (grid với filters), Chi tiết sản phẩm, Giỏ hàng, Checkout, Đơn hàng, Profile, Admin pages.

3. Thanh bên: Bộ lọc sản phẩm (category, price, rating, sort), menu profile sidebar, admin sidebar navigation.

4. Chân trang: Brand section, quick links, danh mục, thông tin liên hệ, social media, copyright.

o Chụp các hình minh họa layout và source code thiết kế kèm chú thích

Hình 4.14: Cấu trúc layout tổng thể của website
[Chèn hình screenshot tại đây: Chụp toàn bộ trang website (trang chủ hoặc trang sản phẩm) với Header, Main Content, Footer. Chú thích các vùng: Header (màu xanh), Main Content (màu vàng), Footer (màu đỏ) để minh họa cấu trúc layout sử dụng thẻ <div> và các vùng Editable Regions.]

Hình 4.15: Source code minh họa cấu trúc layout
[Chèn hình screenshot source code tại đây: Chụp code từ file fe/src/pages/Home.tsx (phần return JSX) hoặc fe/src/components/common/Header.tsx để minh họa cách sử dụng thẻ <div> với Tailwind CSS classes, component structure, và các kỹ thuật thiết kế đã nêu.]