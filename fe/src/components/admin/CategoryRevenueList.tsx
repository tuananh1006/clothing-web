import { formatPrice } from '@/utils/formatters'

interface CategoryRevenue {
  id: string
  name: string
  value: number
  percentage: number
  color: string
}

interface CategoryRevenueListProps {
  data: CategoryRevenue[]
  title?: string
}

const CategoryRevenueList = ({ data, title = 'Tỷ trọng doanh mục' }: CategoryRevenueListProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-text-sub dark:text-gray-400">Không có dữ liệu</p>
      </div>
    )
  }

  // Calculate total for percentage normalization
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const normalizedData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }))

  // Sort by revenue descending
  const sortedData = [...normalizedData].sort((a, b) => b.value - a.value)

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col">
      <h3 className="font-bold text-lg text-text-main dark:text-white mb-6">{title}</h3>
      <div className="space-y-4">
        {sortedData.map((item, index) => {
          const maxRevenue = sortedData[0]?.value || 1
          const widthPercentage = (item.value / maxRevenue) * 100

          return (
            <div key={item.id || index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className="size-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm font-medium text-text-main dark:text-white truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm font-semibold text-text-main dark:text-white whitespace-nowrap">
                    {item.percentage.toFixed(2)}%
                  </span>
                  <span className="text-sm text-text-sub dark:text-gray-400 whitespace-nowrap">
                    {formatPrice(item.value)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: item.color,
                    opacity: 1 - index * 0.1, // Decreasing opacity for visual hierarchy
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
      {sortedData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-sub dark:text-gray-400">Tổng doanh thu</span>
            <span className="text-lg font-bold text-text-main dark:text-white">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryRevenueList

