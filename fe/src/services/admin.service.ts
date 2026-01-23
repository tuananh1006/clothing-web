import api from './api'
import { API_ENDPOINTS, PAGINATION } from '@/utils/constants'
import type { ApiResponse, Product, Order, User, OrderStatus } from '@/types'
import type {
  DashboardStats,
  RevenueChartData,
  StatsOverview,
  OrderStats,
  AdminProductFilters,
  AdminOrderFilters,
  AdminCustomerFilters,
  CustomerDetail,
  CategoryRevenue,
  TopProduct,
} from '@/types/admin.types'

// Re-export types for convenience
export type {
  DashboardStats,
  RevenueChartData,
  StatsOverview,
  OrderStats,
  AdminProductFilters,
  AdminOrderFilters,
  AdminCustomerFilters,
  CategoryRevenue,
  TopProduct,
}

/**
 * Helper function to clean params - remove empty strings, null, undefined
 * and trim string values. Preserves numbers (including 0) and booleans (including false)
 */
const cleanParams = <T extends Record<string, any>>(params: T): Partial<T> => {
  const cleaned: Partial<T> = {}
  for (const key in params) {
    const value = params[key]
    // Skip undefined, null, and empty strings
    if (value === undefined || value === null || value === '') {
      continue
    }
    // Trim strings and skip if empty after trim
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) cleaned[key] = trimmed as T[Extract<keyof T, string>]
    } else {
      // Preserve numbers (including 0) and booleans (including false)
      cleaned[key] = value
    }
  }
  return cleaned
}

/**
 * Lấy dashboard stats
 * Backend endpoint: GET /admin/dashboard/stats
 */
export const getDashboardStats = async (params?: {
  start_date?: string
  end_date?: string
}): Promise<DashboardStats> => {
  try {
    const response = await api.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.ADMIN.DASHBOARD_STATS,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy revenue chart data
 * Backend endpoint: GET /admin/dashboard/revenue-chart
 */
export const getRevenueChart = async (params?: {
  start_date?: string
  end_date?: string
  days?: number
}): Promise<RevenueChartData[]> => {
  try {
    const response = await api.get<ApiResponse<RevenueChartData[]>>(
      API_ENDPOINTS.ADMIN.REVENUE_CHART,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy stats overview
 * Backend endpoint: GET /admin/stats/overview
 */
export const getStatsOverview = async (params?: {
  start_date?: string
  end_date?: string
}): Promise<StatsOverview> => {
  try {
    const response = await api.get<ApiResponse<StatsOverview>>(
      API_ENDPOINTS.ADMIN.STATS_OVERVIEW,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy danh sách products (admin)
 * Backend endpoint: GET /admin/products
 */
export const getProducts = async (
  filters: AdminProductFilters = {}
): Promise<{ products: Product[]; pagination: any }> => {
  try {
    const params = {
      page: filters.page || PAGINATION.DEFAULT_PAGE,
      limit: filters.limit || PAGINATION.DEFAULT_LIMIT,
      ...cleanParams(filters),
    }
    const response = await api.get<ApiResponse<{ products: Product[]; pagination: any }>>(
      API_ENDPOINTS.ADMIN.PRODUCTS,
      { params }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy metadata cho trang products (categories, statuses)
 * Backend endpoint: GET /admin/products/metadata
 */
export const getProductsMetadata = async (): Promise<{
  categories: { id: string; name: string; slug: string }[]
  statuses: { value: string; label: string }[]
}> => {
  try {
    const response = await api.get<
      ApiResponse<{
        categories: { id: string; name: string; slug: string }[]
        statuses: { value: string; label: string }[]
      }>
    >(API_ENDPOINTS.ADMIN.PRODUCTS_METADATA)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy product detail (admin)
 * Backend endpoint: GET /admin/products/:id
 */
export const getProductDetail = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<ApiResponse<Product>>(API_ENDPOINTS.ADMIN.PRODUCT_DETAIL(id))
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Update product
 * Backend endpoint: PUT /admin/products/:id
 */
export const updateProduct = async (id: string, data: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put<ApiResponse<Product>>(API_ENDPOINTS.ADMIN.PRODUCT_DETAIL(id), data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Create product
 * Backend endpoint: POST /admin/products
 */
export const createProduct = async (data: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.post<ApiResponse<Product>>(API_ENDPOINTS.ADMIN.PRODUCTS, data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Delete product (soft delete)
 * Backend endpoint: DELETE /admin/products/:id
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete<ApiResponse<any>>(API_ENDPOINTS.ADMIN.PRODUCT_DETAIL(id))
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy order stats
 * Backend endpoint: GET /admin/orders/stats
 */
export const getOrdersStats = async (): Promise<OrderStats> => {
  try {
    const response = await api.get<ApiResponse<OrderStats>>(API_ENDPOINTS.ADMIN.ORDERS_STATS)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy danh sách orders (admin)
 * Backend endpoint: GET /admin/orders
 */
export const getOrders = async (
  filters: AdminOrderFilters = {}
): Promise<{ orders: Order[]; pagination: any }> => {
  try {
    const params = {
      page: filters.page || PAGINATION.DEFAULT_PAGE,
      limit: filters.limit || PAGINATION.DEFAULT_LIMIT,
      ...cleanParams(filters),
    }
    const response = await api.get<ApiResponse<{ orders: Order[]; pagination: any }>>(
      API_ENDPOINTS.ADMIN.ORDERS,
      { params }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Update order status (admin)
 * Backend endpoint: PUT /admin/orders/:id/status
 */
export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<{ order_id: string; status: string }> => {
  try {
    const response = await api.put<ApiResponse<{ order_id: string; status: string }>>(
      API_ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id),
      { status }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy danh sách customers (admin)
 * Backend endpoint: GET /admin/customers
 */
export const getCustomers = async (
  filters: AdminCustomerFilters = {}
): Promise<{ customers: User[]; pagination: any }> => {
  try {
    const params = {
      page: filters.page || PAGINATION.DEFAULT_PAGE,
      limit: filters.limit || PAGINATION.DEFAULT_LIMIT,
      ...cleanParams(filters),
    }
    const response = await api.get<ApiResponse<{ customers: User[]; pagination: any }>>(
      API_ENDPOINTS.ADMIN.CUSTOMERS,
      { params }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy customer detail (admin)
 * Backend endpoint: GET /admin/customers/:id
 */
export const getCustomerDetail = async (id: string): Promise<CustomerDetail> => {
  try {
    const response = await api.get<ApiResponse<CustomerDetail>>(API_ENDPOINTS.ADMIN.CUSTOMER_DETAIL(id))
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Update customer status (block/unblock)
 * Backend endpoint: PUT /admin/customers/:id/status
 */
export const updateCustomerStatus = async (
  id: string,
  status: 'active' | 'inactive'
): Promise<void> => {
  try {
    await api.put<ApiResponse<any>>(API_ENDPOINTS.ADMIN.CUSTOMER_STATUS(id), { status })
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy settings
 * Backend endpoint: GET /admin/settings
 */
export const getSettings = async (): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.ADMIN.SETTINGS)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Update general settings
 * Backend endpoint: PUT /admin/settings/general
 */
export const updateSettingsGeneral = async (data: any): Promise<void> => {
  try {
    await api.put<ApiResponse<any>>(API_ENDPOINTS.ADMIN.SETTINGS_GENERAL, data)
  } catch (error: any) {
    throw error
  }
}

/**
 * Upload logo
 * Backend endpoint: POST /admin/settings/logo
 */
export const uploadLogo = async (file: File): Promise<{ logo_url: string }> => {
  try {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await api.post<ApiResponse<{ logo_url: string }>>(
      API_ENDPOINTS.ADMIN.SETTINGS_LOGO,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Update payment settings
 * Backend endpoint: PUT /admin/settings/payment
 */
export const updatePaymentSettings = async (data: any): Promise<void> => {
  try {
    await api.put<ApiResponse<any>>(API_ENDPOINTS.ADMIN.SETTINGS_PAYMENT, data)
  } catch (error: any) {
    throw error
  }
}

/**
 * Update shipping settings
 * Backend endpoint: PUT /admin/settings/shipping
 */
export const updateShippingSettings = async (data: any): Promise<void> => {
  try {
    await api.put<ApiResponse<any>>(API_ENDPOINTS.ADMIN.SETTINGS_SHIPPING, data)
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy category revenue (cho pie chart)
 * Backend endpoint: GET /admin/dashboard/category-revenue
 */
export const getCategoryRevenue = async (params?: {
  start_date?: string
  end_date?: string
}): Promise<CategoryRevenue[]> => {
  try {
    const response = await api.get<ApiResponse<CategoryRevenue[]>>(
      API_ENDPOINTS.ADMIN.CATEGORY_REVENUE,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy top products (cho top products list)
 * Backend endpoint: GET /admin/dashboard/top-products
 */
export const getTopProducts = async (params?: {
  start_date?: string
  end_date?: string
  limit?: number
}): Promise<TopProduct[]> => {
  try {
    const response = await api.get<ApiResponse<TopProduct[]>>(
      API_ENDPOINTS.ADMIN.TOP_PRODUCTS,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Interface cho daily revenue
 */
export interface DailyRevenue {
  date: string
  orders: number
  revenue: number
  profit: number
  new_customers: number
  status: 'good' | 'warning' | 'bad'
}

/**
 * Lấy daily revenue (cho daily revenue table)
 * Backend endpoint: GET /admin/dashboard/daily-revenue
 */
export const getDailyRevenue = async (params?: {
  start_date?: string
  end_date?: string
  limit?: number
}): Promise<DailyRevenue[]> => {
  try {
    const response = await api.get<ApiResponse<DailyRevenue[]>>(
      API_ENDPOINTS.ADMIN.DAILY_REVENUE,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Interface cho order status distribution
 */
export interface OrderStatusDistribution {
  status: string
  label: string
  count: number
  revenue: number
  color: string
  icon: string
}

/**
 * Lấy order status distribution (cho order status distribution component)
 * Backend endpoint: GET /admin/dashboard/order-status-distribution
 */
export const getOrderStatusDistribution = async (params?: {
  start_date?: string
  end_date?: string
}): Promise<OrderStatusDistribution[]> => {
  try {
    const response = await api.get<ApiResponse<OrderStatusDistribution[]>>(
      API_ENDPOINTS.ADMIN.ORDER_STATUS_DISTRIBUTION,
      { params: params ? cleanParams(params) : undefined }
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

// Chat types
export interface AdminChat {
  _id: string
  user_id: string
  admin_id?: string
  status: 'open' | 'closed' | 'pending'
  viewed?: boolean // Đã xem hay chưa
  viewed_at?: string // Thời gian admin xem lần cuối
  message_count: number
  unread_count?: number
  last_message: {
    _id: string
    sender_id: string
    sender_role: 'customer' | 'admin'
    message: string
    created_at: string
    read?: boolean
  } | null
  user: {
    _id: string
    name: string
    email: string
    avatar?: string
  } | null
  created_at: string
  updated_at: string
}

export interface AdminChatDetail extends AdminChat {
  messages: Array<{
    _id: string
    sender_id: string
    sender_role: 'customer' | 'admin'
    message: string
    created_at: string
    read?: boolean
  }>
  admin?: {
    _id: string
    name: string
    email: string
    avatar?: string
  } | null
}

/**
 * Lấy danh sách chats cho admin
 * Backend endpoint: GET /admin/chats
 */
export const getChats = async (params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<{
  chats: AdminChat[]
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
}> => {
  try {
    const response = await api.get<ApiResponse<{
      chats: AdminChat[]
      pagination: {
        page: number
        limit: number
        total: number
        total_page: number
      }
    }>>(API_ENDPOINTS.ADMIN.CHATS, {
      params: params ? cleanParams(params) : undefined
    })
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Lấy chi tiết chat cho admin
 * Backend endpoint: GET /admin/chats/:chatId
 */
export const getChatDetail = async (chatId: string): Promise<AdminChatDetail> => {
  try {
    const response = await api.get<ApiResponse<AdminChatDetail>>(
      API_ENDPOINTS.ADMIN.CHAT_DETAIL(chatId)
    )
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin gửi tin nhắn
 * Backend endpoint: POST /admin/chats/messages
 */
export const adminSendMessage = async (data: {
  chat_id: string
  message: string
}): Promise<{
  _id: string
  sender_id: string
  sender_role: 'admin'
  message: string
  created_at: string
}> => {
  try {
    const response = await api.post<ApiResponse<{
      _id: string
      sender_id: string
      sender_role: 'admin'
      message: string
      created_at: string
    }>>(API_ENDPOINTS.ADMIN.CHAT_SEND_MESSAGE, data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin đánh dấu đã đọc
 * Backend endpoint: POST /admin/chats/mark-read
 */
export const adminMarkAsRead = async (chat_id: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.ADMIN.CHAT_MARK_READ, { chat_id })
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin đánh dấu chưa xem
 * Backend endpoint: POST /admin/chats/mark-unviewed
 */
export const adminMarkAsUnviewed = async (chat_id: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.ADMIN.CHAT_MARK_UNVIEWED, { chat_id })
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin xóa tin nhắn
 * Backend endpoint: POST /admin/chats/messages/delete
 */
export const deleteMessage = async (chat_id: string, message_id: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.ADMIN.CHAT_DELETE_MESSAGE, { chat_id, message_id })
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin khôi phục tin nhắn
 * Backend endpoint: POST /admin/chats/messages/restore
 */
export const restoreMessage = async (chat_id: string, message_id: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.ADMIN.CHAT_RESTORE_MESSAGE, { chat_id, message_id })
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin đóng chat (chuyển vào thùng rác)
 * Backend endpoint: POST /admin/chats/close/:chatId
 */
export const adminCloseChat = async (chatId: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.ADMIN.CHAT_CLOSE(chatId))
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin khôi phục chat từ thùng rác
 * Backend endpoint: POST /admin/chats/restore/:chatId
 */
export const adminRestoreChat = async (chatId: string): Promise<void> => {
  try {
    await api.post(API_ENDPOINTS.ADMIN.CHAT_RESTORE(chatId))
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin xóa vĩnh viễn chat
 * Backend endpoint: DELETE /admin/chats/:chatId
 */
export const adminPermanentlyDeleteChat = async (chatId: string): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.ADMIN.CHAT_PERMANENTLY_DELETE(chatId))
  } catch (error: any) {
    throw error
  }
}

/**
 * Admin lấy tin nhắn đã xóa
 * Backend endpoint: GET /admin/chats/:chatId/deleted-messages
 */
export const getDeletedMessages = async (chat_id: string): Promise<Array<{
  _id: string
  sender_id: string
  sender_role: 'customer' | 'admin'
  message: string
  created_at: string
  deleted_at: string
  deleted_by: string
}>> => {
  try {
    const response = await api.get<ApiResponse<Array<{
      _id: string
      sender_id: string
      sender_role: 'customer' | 'admin'
      message: string
      created_at: string
      deleted_at: string
      deleted_by: string
    }>>>(API_ENDPOINTS.ADMIN.CHAT_DELETED_MESSAGES(chat_id))
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

// Banner methods
export const getBanners = async (params?: {
  page?: number
  limit?: number
  position?: string
  is_active?: boolean
}): Promise<{
  banners: Array<{
    _id: string
    title: string
    subtitle?: string
    image_url: string
    alt_text?: string
    cta_text?: string
    cta_link?: string
    order?: number
    position: string
    is_active?: boolean
    created_at?: string
    updated_at?: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
}> => {
  try {
    const response = await api.get<ApiResponse<{
      banners: Array<{
        _id: string
        title: string
        subtitle?: string
        image_url: string
        alt_text?: string
        cta_text?: string
        cta_link?: string
        order?: number
        position: string
        is_active?: boolean
        created_at?: string
        updated_at?: string
      }>
      pagination: {
        page: number
        limit: number
        total: number
        total_page: number
      }
    }>>(API_ENDPOINTS.ADMIN.BANNERS, { params: cleanParams(params || {}) })
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const getBannerDetail = async (id: string): Promise<{
  _id: string
  title: string
  subtitle?: string
  image_url: string
  alt_text?: string
  cta_text?: string
  cta_link?: string
  order?: number
  position: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}> => {
  try {
    const response = await api.get<ApiResponse<{
      _id: string
      title: string
      subtitle?: string
      image_url: string
      alt_text?: string
      cta_text?: string
      cta_link?: string
      order?: number
      position: string
      is_active?: boolean
      created_at?: string
      updated_at?: string
    }>>(API_ENDPOINTS.ADMIN.BANNER_DETAIL(id))
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const createBanner = async (data: {
  title: string
  subtitle?: string
  image_url: string
  alt_text?: string
  cta_text?: string
  cta_link?: string
  order?: number
  position: string
  is_active?: boolean
}): Promise<{
  _id: string
  title: string
  subtitle?: string
  image_url: string
  alt_text?: string
  cta_text?: string
  cta_link?: string
  order?: number
  position: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}> => {
  try {
    const response = await api.post<ApiResponse<{
      _id: string
      title: string
      subtitle?: string
      image_url: string
      alt_text?: string
      cta_text?: string
      cta_link?: string
      order?: number
      position: string
      is_active?: boolean
      created_at?: string
      updated_at?: string
    }>>(API_ENDPOINTS.ADMIN.BANNERS, data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const updateBanner = async (
  id: string,
  data: {
    title?: string
    subtitle?: string
    image_url?: string
    alt_text?: string
    cta_text?: string
    cta_link?: string
    order?: number
    position?: string
    is_active?: boolean
  }
): Promise<{
  _id: string
  title: string
  subtitle?: string
  image_url: string
  alt_text?: string
  cta_text?: string
  cta_link?: string
  order?: number
  position: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}> => {
  try {
    const response = await api.put<ApiResponse<{
      _id: string
      title: string
      subtitle?: string
      image_url: string
      alt_text?: string
      cta_text?: string
      cta_link?: string
      order?: number
      position: string
      is_active?: boolean
      created_at?: string
      updated_at?: string
    }>>(API_ENDPOINTS.ADMIN.BANNER_DETAIL(id), data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const deleteBanner = async (id: string): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.ADMIN.BANNER_DETAIL(id))
  } catch (error: any) {
    throw error
  }
}

// Coupon methods
export const getCoupons = async (params?: {
  page?: number
  limit?: number
  code?: string
  is_active?: boolean
}): Promise<{
  coupons: Array<{
    _id: string
    code: string
    name?: string
    description?: string
    discount_type: 'percentage' | 'fixed_amount'
    discount_value: number
    min_order_value?: number
    max_discount?: number
    usage_limit?: number
    used_count?: number
    valid_from: string
    valid_until: string
    is_active?: boolean
    applicable_to?: 'all' | 'specific_categories' | 'specific_products'
    categories?: string[]
    products?: string[]
    created_at?: string
    updated_at?: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    total_page: number
  }
}> => {
  try {
    const response = await api.get<ApiResponse<{
      coupons: Array<{
        _id: string
        code: string
        name?: string
        description?: string
        discount_type: 'percentage' | 'fixed_amount'
        discount_value: number
        min_order_value?: number
        max_discount?: number
        usage_limit?: number
        used_count?: number
        valid_from: string
        valid_until: string
        is_active?: boolean
        applicable_to?: 'all' | 'specific_categories' | 'specific_products'
        categories?: string[]
        products?: string[]
        created_at?: string
        updated_at?: string
      }>
      pagination: {
        page: number
        limit: number
        total: number
        total_page: number
      }
    }>>(API_ENDPOINTS.ADMIN.COUPONS, { params: cleanParams(params || {}) })
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const getCouponDetail = async (id: string): Promise<{
  _id: string
  code: string
  name?: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  used_count?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
  applicable_to?: 'all' | 'specific_categories' | 'specific_products'
  categories?: string[]
  products?: string[]
  created_at?: string
  updated_at?: string
}> => {
  try {
    const response = await api.get<ApiResponse<{
      _id: string
      code: string
      name?: string
      description?: string
      discount_type: 'percentage' | 'fixed_amount'
      discount_value: number
      min_order_value?: number
      max_discount?: number
      usage_limit?: number
      used_count?: number
      valid_from: string
      valid_until: string
      is_active?: boolean
      applicable_to?: 'all' | 'specific_categories' | 'specific_products'
      categories?: string[]
      products?: string[]
      created_at?: string
      updated_at?: string
    }>>(API_ENDPOINTS.ADMIN.COUPON_DETAIL(id))
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const createCoupon = async (data: {
  code: string
  name?: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
  applicable_to?: 'all' | 'specific_categories' | 'specific_products'
  categories?: string[]
  products?: string[]
}): Promise<{
  _id: string
  code: string
  name?: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  used_count?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
  applicable_to?: 'all' | 'specific_categories' | 'specific_products'
  categories?: string[]
  products?: string[]
  created_at?: string
  updated_at?: string
}> => {
  try {
    const response = await api.post<ApiResponse<{
      _id: string
      code: string
      name?: string
      description?: string
      discount_type: 'percentage' | 'fixed_amount'
      discount_value: number
      min_order_value?: number
      max_discount?: number
      usage_limit?: number
      used_count?: number
      valid_from: string
      valid_until: string
      is_active?: boolean
      applicable_to?: 'all' | 'specific_categories' | 'specific_products'
      categories?: string[]
      products?: string[]
      created_at?: string
      updated_at?: string
    }>>(API_ENDPOINTS.ADMIN.COUPONS, data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const updateCoupon = async (
  id: string,
  data: {
    code?: string
    name?: string
    description?: string
    discount_type?: 'percentage' | 'fixed_amount'
    discount_value?: number
    min_order_value?: number
    max_discount?: number
    usage_limit?: number
    valid_from?: string
    valid_until?: string
    is_active?: boolean
    applicable_to?: 'all' | 'specific_categories' | 'specific_products'
    categories?: string[]
    products?: string[]
  }
): Promise<{
  _id: string
  code: string
  name?: string
  description?: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  min_order_value?: number
  max_discount?: number
  usage_limit?: number
  used_count?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
  applicable_to?: 'all' | 'specific_categories' | 'specific_products'
  categories?: string[]
  products?: string[]
  created_at?: string
  updated_at?: string
}> => {
  try {
    const response = await api.put<ApiResponse<{
      _id: string
      code: string
      name?: string
      description?: string
      discount_type: 'percentage' | 'fixed_amount'
      discount_value: number
      min_order_value?: number
      max_discount?: number
      usage_limit?: number
      used_count?: number
      valid_from: string
      valid_until: string
      is_active?: boolean
      applicable_to?: 'all' | 'specific_categories' | 'specific_products'
      categories?: string[]
      products?: string[]
      created_at?: string
      updated_at?: string
    }>>(API_ENDPOINTS.ADMIN.COUPON_DETAIL(id), data)
    return response.data.data
  } catch (error: any) {
    throw error
  }
}

export const deleteCoupon = async (id: string): Promise<void> => {
  try {
    await api.delete(API_ENDPOINTS.ADMIN.COUPON_DETAIL(id))
  } catch (error: any) {
    throw error
  }
}

