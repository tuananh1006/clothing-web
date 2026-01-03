import { useState } from 'react'

type DateRangeType = 'day' | 'week' | 'month' | 'custom'

interface DateRangeButtonsProps {
  onRangeChange: (range: { start_date?: string; end_date?: string }) => void
}

const DateRangeButtons = ({ onRangeChange }: DateRangeButtonsProps) => {
  const [activeRange, setActiveRange] = useState<DateRangeType>('month')
  const [showCustomPicker, setShowCustomPicker] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const getDateRange = (type: DateRangeType) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (type) {
      case 'day':
        return {
          start_date: today.toISOString().split('T')[0],
          end_date: today.toISOString().split('T')[0],
        }
      case 'week': {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return {
          start_date: weekStart.toISOString().split('T')[0],
          end_date: weekEnd.toISOString().split('T')[0],
        }
      }
      case 'month': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        return {
          start_date: monthStart.toISOString().split('T')[0],
          end_date: monthEnd.toISOString().split('T')[0],
        }
      }
      default:
        return {}
    }
  }

  const handleRangeClick = (type: DateRangeType) => {
    setActiveRange(type)
    setShowCustomPicker(false)
    if (type !== 'custom') {
      onRangeChange(getDateRange(type))
    } else {
      setShowCustomPicker(true)
    }
  }

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onRangeChange({
        start_date: customStart,
        end_date: customEnd,
      })
      setActiveRange('custom')
      setShowCustomPicker(false)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#1a2c32] border border-gray-200 dark:border-gray-800 rounded-lg p-1 shadow-sm">
      <button
        onClick={() => handleRangeClick('day')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          activeRange === 'day'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text-sub hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        Theo ngày
      </button>
      <button
        onClick={() => handleRangeClick('week')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          activeRange === 'week'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text-sub hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        Theo tuần
      </button>
      <button
        onClick={() => handleRangeClick('month')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          activeRange === 'month'
            ? 'bg-primary text-white shadow-sm'
            : 'text-text-sub hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        Tháng này
      </button>
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>
      <div className="relative">
        <button
          onClick={() => handleRangeClick('custom')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeRange === 'custom'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-sub hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>Tùy chọn</span>
        </button>
        {showCustomPicker && (
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#1a2c32] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111d21] text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111d21] text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowCustomPicker(false)
                    setCustomStart('')
                    setCustomEnd('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-text-sub hover:text-text-main dark:hover:text-white transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCustomApply}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DateRangeButtons

