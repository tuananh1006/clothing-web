interface PieChartData {
  name: string
  value: number
  percentage: number
  color: string
}

interface PieChartProps {
  data: PieChartData[]
  title?: string
  centerText?: {
    value: string
    label: string
  }
}

const PieChart = ({ data, title = 'Tỷ trọng doanh mục', centerText }: PieChartProps) => {
  // Calculate total for percentage calculation if not provided
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const normalizedData = data.map((item) => ({
    ...item,
    percentage: item.percentage || (total > 0 ? (item.value / total) * 100 : 0),
  }))

  // Build conic-gradient string
  let currentPercent = 0
  const gradientStops = normalizedData
    .map((item) => {
      const start = currentPercent
      const end = currentPercent + item.percentage
      currentPercent = end
      return `${item.color} ${start}% ${end}%`
    })
    .join(', ')

  // Get center text from largest segment if not provided
  const largestSegment = normalizedData.reduce((prev, current) =>
    prev.percentage > current.percentage ? prev : current
  )
  const displayCenterText = centerText || {
    value: `${largestSegment.percentage.toFixed(2)}%`,
    label: largestSegment.name,
  }

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col">
      <h3 className="font-bold text-lg text-text-main dark:text-white mb-6">{title}</h3>
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
        <div
          className="relative size-48 rounded-full"
          style={{
            background: `conic-gradient(${gradientStops})`,
          }}
        >
          <div className="absolute inset-4 bg-white dark:bg-[#1a2c32] rounded-full flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-text-main dark:text-white">
              {parseFloat(displayCenterText.value.replace('%', '')).toFixed(2)}%
            </span>
            <span className="text-xs text-text-sub dark:text-gray-400">{displayCenterText.label}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {normalizedData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-sm text-text-sub dark:text-gray-400">
              {item.name} ({item.percentage.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart

