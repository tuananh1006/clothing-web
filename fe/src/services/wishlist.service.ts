import api from './api'
import { API_ENDPOINTS } from '@/utils/constants'
import type { Product } from '@/types'
import type { ApiResponse } from '@/types/api.types'

export const getWishlist = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<{ items: Product[] }>>(API_ENDPOINTS.WISHLIST.LIST)
  return response.data.data.items
}

export const addToWishlist = async (productId: string): Promise<void> => {
  await api.post<ApiResponse<void>>(API_ENDPOINTS.WISHLIST.ADD, {
    product_id: productId,
  })
}

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await api.delete<ApiResponse<void>>(API_ENDPOINTS.WISHLIST.REMOVE(productId))
}


