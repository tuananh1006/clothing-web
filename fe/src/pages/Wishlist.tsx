import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ProductCard from '@/components/product/ProductCard'
import { useWishlist } from '@/contexts/WishlistContext'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

const Wishlist = () => {
  const { wishlistProducts } = useWishlist()
  const hasItems = wishlistProducts.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl font-bold text-text-main dark:text-white mb-6">
            Sản phẩm yêu thích
          </h1>

          {!hasItems && (
            <div className="bg-white dark:bg-[#1a2c32] rounded-2xl shadow-md p-8 text-center">
              <p className="text-text-sub dark:text-gray-400 mb-4">
                Bạn chưa có sản phẩm yêu thích nào.
              </p>
              <Link
                to={ROUTES.PRODUCTS}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-[#159cc9] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          )}

          {hasItems && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <ProductCard key={product._id || index} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Wishlist


