import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import ProductCard from '@/components/product/ProductCard'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { getProductDetail, getRelatedProducts } from '@/services/products.service'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/utils/constants'
import { formatPrice } from '@/utils/formatters'
import type { Product } from '@/types'
import type { AddToCartRequest } from '@/types/cart.types'

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { showSuccess, showError } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Product selection state
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [addToCartError, setAddToCartError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError('Product slug is required')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getProductDetail(slug)
        setProduct(data)

        // Set default selections
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
      } catch (err: any) {
        console.error('Error fetching product:', err)
        if (err.message === 'Product not found' || err.response?.status === 404) {
          setError('Sản phẩm không tồn tại')
        } else {
          setError('Không thể tải thông tin sản phẩm')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (!slug || !product) return

      try {
        setIsLoadingRelated(true)
        const data = await getRelatedProducts(slug, 4)
        setRelatedProducts(data)
      } catch (err) {
        console.error('Error fetching related products:', err)
      } finally {
        setIsLoadingRelated(false)
      }
    }

    if (product) {
      fetchRelated()
    }
  }, [slug, product])

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    // Check authentication
    if (!isAuthenticated) {
      navigate(`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    // Validate size if required
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setAddToCartError('Vui lòng chọn kích thước')
      return
    }

    setAddToCartError(null)
    setIsAddingToCart(true)

    try {
      // Ensure product_id is a string and buy_count is an integer
      const cartData: AddToCartRequest = {
        product_id: String(product._id),
        buy_count: Math.floor(quantity), // Ensure integer
      }
      
      // Only include size/color if they have values (not empty strings)
      if (selectedSize && selectedSize.trim()) {
        cartData.size = selectedSize.trim()
      }
      if (selectedColor && selectedColor.trim()) {
        cartData.color = selectedColor.trim()
      }
      
      console.log('Adding to cart with data:', cartData)
      console.log('Product _id:', product._id, 'Type:', typeof product._id)
      
      await addToCart(cartData)
      // Success - cart context will update automatically
      showSuccess('Sản phẩm đã được thêm vào giỏ hàng!')
      setAddToCartError(null)
    } catch (err: any) {
      console.error('Add to cart error:', err)
      console.error('Error response:', err.response?.data)
      
      // Extract validation errors if available
      let errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.'
      if (err.response?.data) {
        if (err.response.data.errors) {
          // Format validation errors
          const errorFields = Object.keys(err.response.data.errors)
          const errorMessages = errorFields.map(
            (field) => `${field}: ${err.response.data.errors[field][0]}`
          )
          errorMessage = `Lỗi validation: ${errorMessages.join(', ')}`
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message
        }
      }
      
      setAddToCartError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const productImages = product?.images && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="flex flex-col gap-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
              error_outline
            </span>
            <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
              {error || 'Sản phẩm không tồn tại'}
            </h1>
            <p className="text-text-sub dark:text-gray-400 mb-6">
              Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate(ROUTES.PRODUCTS)}>
                Xem tất cả sản phẩm
              </Button>
              <Button variant="outline" onClick={() => navigate(ROUTES.HOME)}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const categoryName =
    typeof product.category === 'object' ? product.category.name : ''

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 py-4 text-sm">
            <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">Home</a>
            <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
            {categoryName && (
              <>
                <a className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">{categoryName}</a>
                <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
              </>
            )}
            <span className="text-text-primary-light dark:text-text-primary-dark font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
            {/* Product Images */}
            <div>
              <ProductImageGallery images={productImages} productName={product.name} />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div>
                {categoryName && (
                  <p className="text-sm text-primary font-medium mb-2">{categoryName}</p>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.033em] text-text-primary-light dark:text-text-primary-dark mb-4">
                  {product.name}
                </h1>
                {product.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-lg ${
                            i < Math.floor(product.rating!)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      ({product.rating.toFixed(1)})
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                {product.price_before_discount &&
                  product.price_before_discount > product.price && (
                    <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark line-through">
                      {formatPrice(product.price_before_discount)}
                    </p>
                  )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark mb-3">
                    Mô tả sản phẩm
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selector */}
              <div className="border-b border-[#e7f0f3] dark:border-gray-800 pb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark mb-4">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 px-4 rounded-lg border text-sm font-bold transition-colors ${
                          selectedSize === size
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-700 text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary bg-surface-light dark:bg-surface-dark'
                        }`}
                      >
                        {size}
                      </button>
                    ))
                  ) : null}
                </div>
              </div>

              {/* Color Selector */}
              <div className="border-b border-[#e7f0f3] dark:border-gray-800 pb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark mb-4">
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ring-2 ring-offset-2 ring-transparent ring-offset-background-light dark:ring-offset-background-dark ${
                          selectedColor === color
                            ? 'ring-primary ring-offset-0 scale-110'
                            : 'ring-transparent'
                        }`}
                        style={{
                          backgroundColor: color,
                          borderColor: selectedColor === color ? '#19b3e6' : 'transparent',
                        }}
                        title={color}
                      />
                    ))
                  ) : null}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col gap-2 border-b border-[#e7f0f3] dark:border-gray-800 pb-6">
                <label className="font-bold text-sm uppercase tracking-wider text-text-primary-light dark:text-text-primary-dark">
                  Số lượng
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      if (val >= 1 && val <= product.quantity) {
                        setQuantity(val)
                      }
                    }}
                    className="w-20 text-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Còn {product.quantity} sản phẩm
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0 || isAddingToCart}
                  isLoading={isAddingToCart}
                  className="w-full py-3 text-base font-bold"
                >
                  {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </Button>
                {addToCartError && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {addToCartError}
                  </p>
                )}
              </div>

              {/* Product Info Badges */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="material-symbols-outlined text-lg">local_shipping</span>
                  <span>Miễn phí vận chuyển cho đơn hàng trên 500.000₫</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="material-symbols-outlined text-lg">assignment_return</span>
                  <span>Đổi trả miễn phí trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>Chính hãng 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-8">
                Sản phẩm liên quan
              </h2>
              {isLoadingRelated ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="w-full aspect-[3/4] rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard key={relatedProduct._id} product={relatedProduct} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetail
