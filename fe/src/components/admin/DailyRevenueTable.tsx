import { formatPrice } from '@/utils/formatters'

interface DailyRevenue {
  date: string
  orders: number
  revenue: number
  profit: number
  new_customers: number
  status: 'good' | 'warning' | 'bad'
}

interface DailyRevenueTableProps {
  data: DailyRevenue[]
  title?: string
}

const DailyRevenueTable = ({ data, title = 'Chi tiết doanh thu theo ngày' }: DailyRevenueTableProps) => {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-text-sub dark:text-gray-400">Không có dữ liệu</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'bad':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-text-main dark:text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-text-sub border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
              <th className="font-semibold py-3 px-4 uppercase tracking-wider">Ngày</th>
              <th className="font-semibold py-3 px-4 uppercase tracking-wider text-right">Đơn hàng</th>
              <th className="font-semibold py-3 px-4 uppercase tracking-wider text-right">Doanh thu</th>
              <th className="font-semibold py-3 px-4 uppercase tracking-wider text-right">Lợi nhuận</th>
              <th className="font-semibold py-3 px-4 uppercase tracking-wider text-center">Khách mới</th>
              <th className="font-semibold py-3 px-4 uppercase tracking-wider text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((item, index) => (
              <tr
                key={`${item.date}-${index}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800/50"
              >
                <td className="py-3 px-4 font-medium text-text-main dark:text-white">{formatDate(item.date)}</td>
                <td className="py-3 px-4 text-right">{item.orders}</td>
                <td className="py-3 px-4 text-right font-bold text-text-main dark:text-white">
                  {formatPrice(item.revenue)}
                </td>
                <td className="py-3 px-4 text-right text-green-500 font-medium">{formatPrice(item.profit)}</td>
                <td className="py-3 px-4 text-center">{item.new_customers}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block size-2 rounded-full ${getStatusColor(item.status)}`}></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DailyRevenueTable

