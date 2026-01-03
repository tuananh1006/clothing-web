import { formatPrice } from '@/utils/formatters'

interface OrderStatusData {
  status: string
  label: string
  count: number
  revenue: number
  color: string
  icon: string
}

interface OrderStatusDistributionProps {
  data: OrderStatusData[]
  title?: string
}

const OrderStatusDistribution = ({
  data,
  title = 'Phân bổ đơn hàng',
}: OrderStatusDistributionProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-text-sub dark:text-gray-400">Không có dữ liệu</p>
      </div>
    )
  }

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0)
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col h-full w-full">
      <h3 className="font-bold text-lg text-text-main dark:text-white mb-6">{title}</h3>
      
      <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto">
        {data.map((item, index) => {
          const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0
          const revenuePercentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0

          return (
            <div key={`${item.status}-${index}`} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <span
                      className="material-symbols-outlined text-lg sm:text-xl"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-text-main dark:text-white truncate">
                        {item.label}
                      </span>
                      <span className="text-xs text-text-sub dark:text-gray-400 whitespace-nowrap">
                        ({item.count} đơn)
                      </span>
                    </div>
                    <div className="text-xs text-text-sub dark:text-gray-400 mt-0.5 truncate">
                      {formatPrice(item.revenue)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 sm:ml-4 sm:flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm font-bold text-text-main dark:text-white">
                      {percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-text-sub dark:text-gray-400">
                      {revenuePercentage.toFixed(1)}% doanh thu
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {totalOrders > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-sub dark:text-gray-400">Tổng đơn hàng</span>
            <span className="text-lg font-bold text-text-main dark:text-white">{totalOrders} đơn</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-text-sub dark:text-gray-400">Tổng doanh thu</span>
            <span className="text-lg font-bold text-text-main dark:text-white">
              {formatPrice(totalRevenue)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderStatusDistribution

