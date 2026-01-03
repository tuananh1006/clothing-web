import { Link } from 'react-router-dom'
import { formatCompactNumber } from '@/utils/formatters'
import { ROUTES } from '@/utils/constants'

interface TopProduct {
  id: string
  name: string
  image?: string
  revenue: number
  sold_count: number
  percentage?: number // Percentage for progress bar (0-100)
}

interface TopProductsListProps {
  products: TopProduct[]
  title?: string
  showViewAll?: boolean
  onViewAll?: () => void
}

const TopProductsList = ({
  products,
  title = 'Top sản phẩm bán chạy',
  showViewAll = true,
  onViewAll,
}: TopProductsListProps) => {
  // Calculate max revenue for percentage calculation if not provided
  const maxRevenue = Math.max(...products.map((p) => p.revenue), 1)
  const productsWithPercentage = products.map((product) => ({
    ...product,
    percentage: product.percentage || (product.revenue / maxRevenue) * 100,
  }))

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-text-main dark:text-white">{title}</h3>
        {showViewAll && (
          <Link
            to={onViewAll ? '#' : ROUTES.ADMIN_PRODUCTS}
            onClick={(e) => {
              if (onViewAll) {
                e.preventDefault()
                onViewAll()
              }
            }}
            className="text-sm text-primary hover:underline"
          >
            Xem tất cả
          </Link>
        )}
      </div>
      <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto">
        {productsWithPercentage.map((product, index) => {
          const opacity = 1 - index * 0.1 // Decreasing opacity for visual hierarchy (reduced for more items)
          // Use combination of id and index to ensure unique keys
          const uniqueKey = `${product.id}-${index}`
          return (
            <div key={uniqueKey} className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-sm">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {product.image ? (
                    <div
                      className="size-8 sm:size-10 rounded bg-gray-100 dark:bg-gray-800 bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${product.image})` }}
                    ></div>
                  ) : (
                    <div className="size-8 sm:size-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-gray-400 text-base sm:text-lg">image</span>
                    </div>
                  )}
                  <span className="font-medium text-text-main dark:text-white truncate text-xs sm:text-sm">
                    {product.name}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 sm:ml-4">
                  <span className="font-bold text-text-main dark:text-white text-xs sm:text-sm">
                    {formatCompactNumber(product.revenue)}
                  </span>
                  <span className="text-xs font-normal text-text-sub dark:text-gray-400">
                    ({product.sold_count} đã bán)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${product.percentage}%`,
                    opacity: opacity,
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopProductsList

