import { useAuth as useAuthContext } from '@/contexts/AuthContext'

/**
 * Custom hook để access auth context
 * Wrapper cho useAuth từ AuthContext để dễ sử dụng
 */
export const useAuth = () => {
  return useAuthContext()
}

