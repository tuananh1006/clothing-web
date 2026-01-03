import api from './api'
import { API_ENDPOINTS, PAGINATION } from '@/utils/constants'
import type { ApiResponse, Product, Order, User } from '@/types'
import type {
  DashboardStats,
  RevenueChartData,
  StatsOverview,
  OrderStats,
  AdminProductFilters,
  AdminOrderFilters,
  AdminCustomerFilters,
  CustomerDetail,
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
      { params }
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
      { params }
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
      { params }
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
      ...filters,
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
      ...filters,
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
 * Lấy danh sách customers (admin)
 * Backend endpoint: GET /admin/customers
 */
export const getCustomers = async (
  filters: AdminCustomerFilters = {}
): Promise<{ customers: User[]; pagination: any }> => {
  try {
    // Build params object, only include non-empty values
    const params: any = {
      page: filters.page || PAGINATION.DEFAULT_PAGE,
      limit: filters.limit || PAGINATION.DEFAULT_LIMIT,
    }

    // Only add keyword if it's not empty
    if (filters.keyword && filters.keyword.trim()) {
      params.keyword = filters.keyword.trim()
    }

    // Only add status if it's not empty (including 'active', 'inactive', 'new')
    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim()
    }

    // Backend will use default sort_by='created_at' and order='desc' if not provided

    console.log('API call params:', params)

    const response = await api.get<ApiResponse<{ customers: User[]; pagination: any }>>(
      API_ENDPOINTS.ADMIN.CUSTOMERS,
      { params }
    )
    return response.data.data
  } catch (error: any) {
    console.error('API error:', error)
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

