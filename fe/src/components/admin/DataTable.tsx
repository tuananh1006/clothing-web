import { ReactNode } from 'react'
import Skeleton from '@/components/common/Skeleton'

export interface Column<T> {
  key: string
  header: string | ReactNode
  render: (item: T, index?: number) => ReactNode
  sortable?: boolean
  headerClassName?: string
  cellClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
}

const DataTable = <T extends { _id?: string; id?: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  onSort,
  sortKey,
  sortDirection,
}: DataTableProps<T>) => {
  const handleSort = (key: string) => {
    if (!onSort) return
    const newDirection =
      sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDirection)
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                {columns.map((_col, index) => (
                  <th key={index} className="p-4 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                    <Skeleton className="h-4 w-24" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  {columns.map((_col, index) => (
                    <td key={index} className="p-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
          inbox
        </span>
        <p className="text-text-sub dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 ${col.headerClassName || ''} ${col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {typeof col.header === 'string' ? <span>{col.header}</span> : col.header}
                    {col.sortable && typeof col.header === 'string' && (
                      <span className="material-symbols-outlined text-base">
                        {sortKey === col.key
                          ? sortDirection === 'asc'
                            ? 'arrow_upward'
                            : 'arrow_downward'
                          : 'unfold_more'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {data.map((item, rowIndex) => (
              <tr
                key={item._id || item.id || Math.random()}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`p-4 text-text-main dark:text-white ${col.cellClassName || ''}`}>
                    {col.render(item, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable

