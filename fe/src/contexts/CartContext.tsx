import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  getCart,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  deleteCartItem as deleteCartItemService,
  CartResponse,
  CartItemResponse,
} from '@/services/cart.service'
import type { AddToCartRequest, UpdateCartItemRequest } from '@/types/cart.types'

interface CartContextType {
  items: CartItemResponse[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addToCart: (data: AddToCartRequest) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.buy_count, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.buy_count,
    0
  )

  // Fetch cart from API
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }

    try {
      setIsLoading(true)
      const cartData: CartResponse = await getCart()
      setItems(cartData.items || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto fetch cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setItems([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // Add to cart
  const addToCart = async (data: AddToCartRequest) => {
    try {
      await addToCartService(data)
      // Refresh cart after adding
      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  // Update quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      throw new Error('Số lượng phải lớn hơn 0')
    }

    try {
      const updateData: UpdateCartItemRequest = { buy_count: quantity }
      await updateCartItemService(itemId, updateData)
      // Refresh cart after updating
      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  // Remove item
  const removeItem = async (itemId: string) => {
    try {
      await deleteCartItemService(itemId)
      // Refresh cart after removing
      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  // Clear cart (local only, doesn't call API)
  const clearCart = () => {
    setItems([])
  }

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

