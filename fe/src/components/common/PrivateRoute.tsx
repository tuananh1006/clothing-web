import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import Spinner from './Spinner'

interface PrivateRouteProps {
  children: ReactNode
}

/**
 * Component để bảo vệ routes cần authentication
 * Redirect to login nếu chưa authenticated
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-text-sub">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login với returnUrl để quay lại sau khi login
    return (
      <Navigate
        to={`${ROUTES.LOGIN}?returnUrl=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return <>{children}</>
}

export default PrivateRoute

