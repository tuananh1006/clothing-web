// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    SOCIAL_LOGIN: '/users/social-login',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
    VERIFY_FORGOT_PASSWORD: '/users/verify-forgot-password',
  },
  USERS: {
    ME: '/users/me',
    UPLOAD_AVATAR: '/users/me/avatar',
  },
  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug: string) => `/products/${slug}`,
    RELATED: (slug: string) => `/products/${slug}/related`,
  },
  // Categories
  CATEGORIES: {
    LIST: '/categories',
  },
  // Banners
  BANNERS: {
    LIST: '/banners',
  },
  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
    DELETE_ITEM: (itemId: string) => `/cart/items/${itemId}`,
  },
  // Locations
  LOCATIONS: {
    PROVINCES: '/locations/provinces',
    DISTRICTS: (provinceId: string) => `/locations/districts/${provinceId}`,
    WARDS: (districtId: string) => `/locations/wards/${districtId}`,
  },
  // Checkout
  CHECKOUT: {
    INIT: '/checkout/init',
    VALIDATE_SHIPPING: '/checkout/validate-shipping',
    PAYMENT_INFO: '/checkout/payment-info',
    PLACE_ORDER: '/checkout/place-order',
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (orderId: string) => `/orders/${orderId}`,
  },
  // Contact
  CONTACT: {
    SUBMIT: '/contact/submit',
  },
  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    REVENUE_CHART: '/admin/dashboard/revenue-chart',
    STATS_OVERVIEW: '/admin/stats/overview',
    PRODUCTS: '/admin/products',
    PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
    ORDERS: '/admin/orders',
    ORDERS_STATS: '/admin/orders/stats',
    CUSTOMERS: '/admin/customers',
    CUSTOMER_DETAIL: (id: string) => `/admin/customers/${id}`,
    CUSTOMER_STATUS: (id: string) => `/admin/customers/${id}/status`,
    REVIEWS: '/admin/reviews',
    SETTINGS: '/admin/settings',
    SETTINGS_GENERAL: '/admin/settings/general',
    SETTINGS_LOGO: '/admin/settings/logo',
    SETTINGS_PAYMENT: '/admin/settings/payment',
    SETTINGS_SHIPPING: '/admin/settings/shipping',
  },
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CATEGORIES: '/categories',
  SEARCH: '/search',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_PAYMENT: '/checkout/payment',
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId: string) => `/orders/${orderId}`,
  ORDER_SUCCESS: (orderId: string) => `/orders/${orderId}/success`,
  PROFILE: '/profile',
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  SIZE_GUIDE: '/size-guide',
  NOT_FOUND: '/404',
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_SETTINGS: '/admin/settings',
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const

