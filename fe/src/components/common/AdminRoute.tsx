import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'
import { UserRole } from '@/types'
import Spinner from './Spinner'

interface AdminRouteProps {
  children: ReactNode
}

/**
 * Component để bảo vệ admin routes
 * Cần authentication + admin role
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-text-sub">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user?.role !== UserRole.Admin) {
    // Redirect to home nếu không phải admin
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}

export default AdminRoute

