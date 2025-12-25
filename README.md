# 🛍️ YORI Fashion - E-Commerce Platform

> Nền tảng thương mại điện tử thời trang tối giản, được xây dựng với React + TypeScript và Node.js + Express

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📖 Tổng Quan

YORI Fashion là một nền tảng thương mại điện tử hoàn chỉnh cho ngành thời trang, được thiết kế với triết lý tối giản và trải nghiệm người dùng tối ưu. Dự án bao gồm:

- **Frontend**: React 18 + TypeScript với Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Styling**: TailwindCSS với Dark Mode support

## ✨ Tính Năng Chính

### 👤 Người Dùng
- ✅ Đăng ký / Đăng nhập với JWT Authentication
- ✅ Quản lý giỏ hàng (thêm, sửa, xóa sản phẩm)
- ✅ Thanh toán và đặt hàng
- ✅ Quản lý đơn hàng và theo dõi trạng thái
- ✅ Quản lý profile và avatar
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Xem chi tiết sản phẩm với gallery
- ✅ Hướng dẫn chọn size
- ✅ Dark Mode

### 👨‍💼 Admin
- ✅ Dashboard với thống kê và biểu đồ
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý khách hàng
- ✅ Cài đặt hệ thống (thông tin cửa hàng, thanh toán, vận chuyển)

### 🔧 Kỹ Thuật
- ✅ Automatic token refresh (proactive refresh trước khi expire)
- ✅ Request/Response interceptors
- ✅ Form validation với Zod + React Hook Form
- ✅ Error handling và Toast notifications
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ SEO-friendly routing
- ✅ Type-safe với TypeScript

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống

- **Node.js** >= 18.x
- **MongoDB** >= 6.0 (hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

### Cài Đặt

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd clothing-web
   ```

2. **Cài đặt Backend:**
   ```bash
   cd be
   npm install
   cp .env.example .env
   # Điền các giá trị vào .env (database, JWT secret, etc.)
   npm run db:seed  # Seed database với dữ liệu mẫu
   npm run dev      # Start development server
   ```

3. **Cài đặt Frontend:**
   ```bash
   cd ../fe
   npm install
   cp .env.example .env
   # Điều chỉnh VITE_API_URL nếu cần
   npm run dev      # Start development server
   ```

4. **Truy cập ứng dụng:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/v1

### 🔑 Tài Khoản Mặc Định

Sau khi chạy seed script:

**Admin:**
- Email: `admin@yori.com`
- Password: `admin123`

**Test Users:**
- Email: `customer1@test.com` / Password: `123456`
- Email: `customer2@test.com` / Password: `123456`
- Email: `customer3@test.com` / Password: `123456`

## 📁 Cấu Trúc Dự Án

```
clothing-web/
├── be/                      # Backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/          # Data models & schemas
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Express middlewares
│   │   ├── utils/           # Utility functions
│   │   └── docs/            # OpenAPI specifications
│   ├── .env.example
│   └── README.md
│
├── fe/                      # Frontend React App
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── common/      # Header, Footer, Button, etc.
│   │   │   ├── product/     # ProductCard, ProductList
│   │   │   ├── cart/        # CartItem, CartSummary
│   │   │   ├── checkout/    # CheckoutForm, AddressForm
│   │   │   └── admin/       # Admin components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── contexts/        # React Context
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── README.md
│
├── docs/                    # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── ENVIRONMENT_VARIABLES.md
│   ├── PLAN.md
│   └── ...
│
└── ui/                      # Original UI HTML files
    └── *.html
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2+ với TypeScript
- **Build Tool**: Vite 5.0+
- **Routing**: React Router v6
- **State Management**: React Context API + Custom Hooks
- **Styling**: TailwindCSS 3.3+
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Charts**: Recharts (Admin Dashboard)
- **Icons**: Material Symbols

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.2+
- **Language**: TypeScript 5.9+
- **Database**: MongoDB 7.0+
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Email**: Nodemailer (optional)
- **File Upload**: Multer

## 📚 Documentation

### Backend
- **[Backend README](./be/README.md)** - Hướng dẫn chi tiết về Backend
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Chi tiết tất cả API endpoints
- **[Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)** - Documentation về biến môi trường
- **[Seed Data](./docs/SEED_DATA.md)** - Hướng dẫn về seed data

### Frontend
- **[Frontend README](./fe/README.md)** - Hướng dẫn chi tiết về Frontend
- **[Frontend Checklist](./docs/FRONTEND_CHECKLIST.md)** - Checklist phát triển Frontend
- **[UI Comparison Report](./docs/UI_COMPARISON_REPORT.md)** - So sánh với UI gốc

### Development
- **[Development Plan](./docs/PLAN.md)** - Kế hoạch phát triển
- **[Test Checklist](./docs/TEST_CHECKLIST.md)** - API testing checklist

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/v1/products` - Danh sách sản phẩm
- `GET /api/v1/products/:slug` - Chi tiết sản phẩm
- `GET /api/v1/categories` - Danh sách danh mục
- `GET /api/v1/banners` - Danh sách banners
- `POST /api/v1/users/register` - Đăng ký
- `POST /api/v1/users/login` - Đăng nhập
- `POST /api/v1/users/forgot-password` - Quên mật khẩu
- `POST /api/v1/users/reset-password` - Đặt lại mật khẩu
- `POST /api/v1/contact/submit` - Gửi liên hệ

### Protected Endpoints (Yêu cầu Authentication)
- `GET /api/v1/users/me` - Thông tin user hiện tại
- `PATCH /api/v1/users/me` - Cập nhật profile
- `POST /api/v1/users/me/avatar` - Upload avatar
- `GET /api/v1/cart` - Lấy giỏ hàng
- `POST /api/v1/cart/items` - Thêm vào giỏ hàng
- `PUT /api/v1/cart/items/:item_id` - Cập nhật giỏ hàng
- `DELETE /api/v1/cart/items/:item_id` - Xóa khỏi giỏ hàng
- `GET /api/v1/checkout/init` - Khởi tạo checkout
- `POST /api/v1/checkout/place-order` - Đặt hàng
- `GET /api/v1/orders` - Danh sách đơn hàng
- `GET /api/v1/orders/:order_id` - Chi tiết đơn hàng

### Admin Endpoints (Yêu cầu Admin Role)
- `GET /api/v1/admin/dashboard/stats` - Thống kê dashboard
- `GET /api/v1/admin/products` - Quản lý sản phẩm
- `GET /api/v1/admin/orders` - Quản lý đơn hàng
- `GET /api/v1/admin/customers` - Quản lý khách hàng
- `GET /api/v1/admin/settings` - Cài đặt hệ thống

Xem chi tiết trong [API Documentation](./docs/API_DOCUMENTATION.md).

## 🔐 Authentication

Hệ thống sử dụng JWT (JSON Web Tokens) cho authentication:

- **Access Token**: Hết hạn sau 15 phút (mặc định, khuyến nghị: 1h cho production)
- **Refresh Token**: Hết hạn sau 7 ngày (mặc định, khuyến nghị: 30d cho production)

### Automatic Token Refresh

Frontend tự động refresh token:
- ✅ Refresh trước khi hết hạn (5 phút trước)
- ✅ Refresh khi user quay lại tab/window
- ✅ Refresh khi user focus vào window
- ✅ Queue requests khi đang refresh để tránh multiple refresh calls

## 📝 Scripts

### Backend (`be/`)
```bash
npm run dev          # Start development server với nodemon
npm run db:seed      # Seed database với initial data
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run prettier     # Check code formatting
npm run prettier:fix # Fix code formatting
```

### Frontend (`fe/`)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🧪 Testing

Xem [TEST_CHECKLIST.md](./docs/TEST_CHECKLIST.md) để biết cách test API endpoints.

## 🔒 Security Features

- ✅ Password hashing với SHA256 + secret
- ✅ JWT tokens với expiration
- ✅ CORS configuration
- ✅ Input validation với express-validator
- ✅ Error handling middleware
- ✅ Automatic token refresh
- ✅ Request/Response interceptors

## 🎨 UI/UX Features

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark Mode support
- ✅ Toast notifications
- ✅ Loading states và skeletons
- ✅ Error boundaries
- ✅ Form validation với real-time feedback
- ✅ Smooth transitions và animations

## 📦 Environment Variables

### Backend (`.env` trong `be/`)
```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=yori_db

# JWT
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRE_IN=15m
REFRESH_TOKEN_EXPIRE_IN=7d

# SMTP (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

### Frontend (`.env` trong `fe/`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Xem chi tiết trong [ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md).

## 🚧 Development Status

### ✅ Completed
- [x] Backend API hoàn chỉnh
- [x] Frontend React app với tất cả pages
- [x] Authentication & Authorization
- [x] Cart & Checkout flow
- [x] Order management
- [x] Admin dashboard
- [x] Automatic token refresh
- [x] UI/UX alignment với design gốc

### 🔄 In Progress
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews & ratings
- [ ] Wishlist feature

### 📋 Planned
- [ ] Multi-language support
- [ ] Advanced search & filters
- [ ] Product recommendations
- [ ] Analytics & reporting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC License

## 👥 Team

YORI Fashion Development Team

## 📞 Contact & Support

- **Email**: support@yori.com
- **Website**: https://yori.com

---

**Made with ❤️ by YORI Fashion Team**

*Last Updated: 2024*

