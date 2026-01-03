import { formatPrice, formatCompactNumber } from '@/utils/formatters'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: string
  iconBgColor?: 'blue' | 'purple' | 'orange' | 'green'
  trend?: {
    value: number
    isPositive: boolean
  }
  formatCurrency?: boolean
  unit?: string // Unit text như "VNĐ", "đơn", "conversion"
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor = 'blue',
  trend,
  formatCurrency = false,
  unit,
}: StatsCardProps) => {
  // Format value
  let displayValue: string
  if (formatCurrency && typeof value === 'number') {
    // Format như "345.2M VNĐ"
    const compact = formatCompactNumber(value)
    displayValue = compact
  } else if (typeof value === 'number') {
    // Format số thường như "1,540"
    displayValue = new Intl.NumberFormat('vi-VN').format(value)
  } else {
    displayValue = value
  }

  // Icon background colors
  const iconBgClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-primary',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  }

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        {icon && (
          <div className={`p-2.5 ${iconBgClasses[iconBgColor]} rounded-lg`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
        {trend && (
          <span
            className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
              trend.isPositive
                ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                : 'text-red-500 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value).toFixed(2)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-text-sub dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-text-main dark:text-white">
          {displayValue}
          {unit && <span className="text-sm font-normal text-text-sub ml-1">{unit}</span>}
        </h3>
      </div>
    </div>
  )
}

export default StatsCard

