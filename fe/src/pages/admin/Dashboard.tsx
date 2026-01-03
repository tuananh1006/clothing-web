import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import StatsCard from '@/components/admin/StatsCard'
import Chart from '@/components/admin/Chart'
import PieChart from '@/components/admin/PieChart'
import TopProductsList from '@/components/admin/TopProductsList'
import DateRangeButtons from '@/components/admin/DateRangeButtons'
import Skeleton from '@/components/common/Skeleton'
import { useToast } from '@/contexts/ToastContext'
import * as adminService from '@/services/admin.service'

const AdminDashboard = () => {
  const [stats, setStats] = useState<adminService.DashboardStats | null>(null)
  const [chartData, setChartData] = useState<adminService.RevenueChartData[]>([])
  const [categoryData, setCategoryData] = useState<adminService.CategoryRevenue[]>([])
  const [topProducts, setTopProducts] = useState<adminService.TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{ start_date?: string; end_date?: string }>({})

  const { showError } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch all dashboard data in parallel
        // Note: revenue chart uses days=30 if no date range is specified
        const chartParams = dateRange.start_date || dateRange.end_date
          ? dateRange
          : { ...dateRange, days: 30 }

        const [statsData, chartDataResult, categoryRevenueData, topProductsData] = await Promise.all([
          adminService.getDashboardStats(dateRange),
          adminService.getRevenueChart(chartParams),
          adminService.getCategoryRevenue(dateRange),
          adminService.getTopProducts({ ...dateRange, limit: 4 }),
        ])
        setStats(statsData)
        setChartData(chartDataResult)
        setCategoryData(categoryRevenueData)
        setTopProducts(topProductsData)
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error)
        showError(error.response?.data?.message || 'Không thể tải dữ liệu dashboard.')
        // Set empty arrays on error to prevent crashes
        setCategoryData([])
        setTopProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, showError])

  const handleDateRangeChange = (range: { start_date?: string; end_date?: string }) => {
    setDateRange(range)
  }

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-main dark:text-white mb-1">
              Báo cáo & Thống kê
            </h2>
            <p className="text-sm text-text-sub dark:text-gray-400">
              Xem chi tiết hiệu quả kinh doanh và hành vi khách hàng.
            </p>
          </div>
          <DateRangeButtons onRangeChange={handleDateRangeChange} />
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Doanh thu thuần"
              value={stats.total_revenue}
              icon="payments"
              iconBgColor="blue"
              formatCurrency
              unit="VNĐ"
              trend={
                stats.revenue_change !== undefined
                  ? {
                      value: stats.revenue_change,
                      isPositive: stats.revenue_change >= 0,
                    }
                  : undefined
              }
            />
            <StatsCard
              title="Tổng đơn hàng"
              value={stats.total_orders}
              icon="shopping_bag"
              iconBgColor="purple"
              unit="đơn"
              trend={
                stats.orders_change !== undefined
                  ? {
                      value: stats.orders_change,
                      isPositive: stats.orders_change >= 0,
                    }
                  : undefined
              }
            />
            <StatsCard
              title="Tổng khách hàng"
              value={stats.total_customers}
              icon="people"
              iconBgColor="orange"
              trend={
                stats.customers_change !== undefined
                  ? {
                      value: stats.customers_change,
                      isPositive: stats.customers_change >= 0,
                    }
                  : undefined
              }
            />
            <StatsCard
              title="Tổng sản phẩm"
              value={stats.total_products}
              icon="inventory"
              iconBgColor="green"
              trend={
                stats.products_change !== undefined
                  ? {
                      value: stats.products_change,
                      isPositive: stats.products_change >= 0,
                    }
                  : undefined
              }
            />
          </div>
        ) : null}

        {/* Revenue Chart */}
        {loading ? (
          <Skeleton className="h-80 w-full rounded-xl mb-8" />
        ) : (
          <Chart
            data={chartData}
            type="line"
            height={320}
            title="Biểu đồ tăng trưởng"
            subtitle="So sánh doanh thu (xanh) và lợi nhuận (tím) qua các tháng"
            showExportButton
          />
        )}

        {/* Pie Chart and Top Products */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 mt-8">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="lg:col-span-2">
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 mt-8">
            {categoryData.length > 0 ? (
              <PieChart
                data={categoryData}
                centerText={
                  categoryData.length > 0
                    ? {
                        value: `${categoryData[0].percentage.toFixed(0)}%`,
                        label: categoryData[0].name,
                      }
                    : undefined
                }
              />
            ) : (
              <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
                <p className="text-text-sub dark:text-gray-400">Không có dữ liệu</p>
              </div>
            )}
            <div className="lg:col-span-2">
              {topProducts.length > 0 ? (
                <TopProductsList products={topProducts} />
              ) : (
                <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
                  <p className="text-text-sub dark:text-gray-400">Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
