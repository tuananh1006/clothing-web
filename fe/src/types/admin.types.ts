/**
 * Interface cho dashboard stats
 */
export interface DashboardStats {
  total_revenue: number
  total_orders: number
  total_customers: number
  total_products: number
  revenue_change?: number
  orders_change?: number
  customers_change?: number
  products_change?: number
}

/**
 * Interface cho revenue chart data
 */
export interface RevenueChartData {
  date: string
  revenue: number
  orders: number
}

/**
 * Interface cho stats overview
 */
export interface StatsOverview {
  today: DashboardStats
  this_week: DashboardStats
  this_month: DashboardStats
  this_year: DashboardStats
}

/**
 * Interface cho order stats
 */
export interface OrderStats {
  pending: number
  processing: number
  shipping: number
  completed: number
  cancelled: number
  total: number
}

/**
 * Interface cho admin product filters
 */
export interface AdminProductFilters {
  page?: number
  limit?: number
  keyword?: string
  category_id?: string
  category_slug?: string
  status?: string
  sort_by?: string
  order?: 'asc' | 'desc'
}

/**
 * Interface cho admin order filters
 */
export interface AdminOrderFilters {
  page?: number
  limit?: number
  keyword?: string
  status?: string
  date_from?: string
  date_to?: string
  sort_by?: string
  order?: 'asc' | 'desc'
}

/**
 * Interface cho admin customer filters
 */
export interface AdminCustomerFilters {
  page?: number
  limit?: number
  keyword?: string
  status?: string
  sort_by?: string
  order?: 'asc' | 'desc'
}

/**
 * Interface cho customer detail response
 */
export interface CustomerDetail {
  id: string
  info: {
    name: string
    email: string
    phone: string
  }
  addresses: Array<{
    id: number
    full_address: string
    is_default: boolean
  }>
  recent_orders: Array<{
    order_code: string
    created_at: Date | string
    status: string
    'cost_summary.total': number
  }>
}

