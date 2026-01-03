import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartProps {
  data: Array<{ date: string; revenue: number; orders?: number }>
  type?: 'line' | 'bar'
  height?: number
  title?: string
  subtitle?: string
  showExportButton?: boolean
  onExport?: () => void
}

const Chart = ({
  data,
  type = 'line',
  height = 300,
  title = 'Biểu đồ tăng trưởng',
  subtitle,
  showExportButton = false,
  onExport,
}: ChartProps) => {
  const ChartComponent = type === 'line' ? LineChart : BarChart
  const DataComponent = type === 'line' ? Line : Bar

  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      // Default export behavior - download as CSV
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Ngày,Doanh thu' +
        '\n' +
        data.map((item) => `${item.date},${item.revenue}`).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'bao-cao-doanh-thu.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      {(title || showExportButton) && (
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-text-main dark:text-white">{title}</h3>
            {subtitle && (
              <p className="text-xs text-text-sub dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
          {showExportButton && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm text-text-sub hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất báo cáo
            </button>
          )}
        </div>
      )}
      <div className="relative rounded-lg border border-gray-50 dark:border-gray-800/50 p-4 chart-grid">
        <style>{`
          .chart-grid {
            background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
            background-size: 40px 40px;
          }
          .dark .chart-grid {
            background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          }
        `}</style>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'currentColor' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-white)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <DataComponent
              type="monotone"
              dataKey="revenue"
              stroke="#19b3e6"
              fill="#19b3e6"
              name="Doanh thu"
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart

