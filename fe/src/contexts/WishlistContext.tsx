import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Product } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { getWishlist, addToWishlist, removeFromWishlist } from '@/services/wishlist.service'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

interface WishlistContextValue {
  wishlistProducts: Product[]
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const { user, isAuthenticated } = useAuth()
  const { showError, showSuccess } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        setWishlistProducts([])
        return
      }
      try {
        const items = await getWishlist()
        setWishlistProducts(items)
      } catch (error: any) {
        console.error('Failed to load wishlist:', error)
      }
    }

    fetchWishlist()
  }, [isAuthenticated, user?._id])

  const isInWishlist = (productId: string): boolean => {
    return wishlistProducts.some((item) => item._id === productId)
  }

  const toggleWishlist = async (product: Product) => {
    if (!isAuthenticated) {
      showError('Vui lòng đăng nhập để sử dụng danh sách yêu thích')
      navigate(ROUTES.LOGIN)
      return
    }

    const productId = product._id
    if (!productId) return

    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId)
        setWishlistProducts((prev) => prev.filter((item) => item._id !== productId))
        showSuccess('Đã xoá khỏi danh sách yêu thích')
      } else {
        await addToWishlist(productId)
        setWishlistProducts((prev) => [product, ...prev])
        showSuccess('Đã thêm vào danh sách yêu thích')
      }
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Không thể cập nhật danh sách yêu thích')
    }
  }

  const value: WishlistContextValue = {
    wishlistProducts,
    isInWishlist,
    toggleWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = (): WishlistContextValue => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}


