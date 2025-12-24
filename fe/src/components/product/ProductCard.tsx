import { Link } from 'react-router-dom'
import { Product } from '@/types/product.types'
import { formatPrice } from '@/utils/formatters'
import { ROUTES } from '@/utils/constants'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const productUrl = ROUTES.PRODUCT_DETAIL(
    typeof product.slug === 'string' ? product.slug : ''
  )

  return (
    <div className="group cursor-pointer">
      <Link to={productUrl}>
        <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4 bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-white/90 dark:bg-black/60 p-2 rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors"
              aria-label="Add to favorites"
            >
              <span className="material-symbols-outlined text-lg">favorite</span>
            </button>
          </div>
        </div>
        <h3 className="text-text-main dark:text-white text-lg font-bold group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.colors && product.colors.length > 0 && (
          <p className="text-text-sub dark:text-gray-400 text-sm">
            {product.colors.join(' / ')}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-text-main dark:text-white font-medium">
            {formatPrice(product.price)}
          </p>
          {product.price_before_discount && product.price_before_discount > product.price && (
            <p className="text-text-sub dark:text-gray-400 text-sm line-through">
              {formatPrice(product.price_before_discount)}
            </p>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <span className="material-symbols-outlined text-yellow-400 text-sm">
              star
            </span>
            <span className="text-sm text-text-sub dark:text-gray-400">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}
      </Link>
    </div>
  )
}

export default ProductCard

