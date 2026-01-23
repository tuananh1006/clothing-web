import { BrowserRouter, useRoutes, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { ThemeContextProvider } from '@/contexts/ThemeContext'
import { ToastContextProvider } from '@/contexts/ToastContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import ChatBox from '@/components/chat/ChatBox'
import { routes } from './routes'

const AppRoutes = () => {
  const element = useRoutes(routes)
  return element
}

const ConditionalChatBox = () => {
  const location = useLocation()
  // Ẩn ChatBox ở trang admin
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  if (isAdminRoute) {
    return null
  }
  
  return <ChatBox />
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <BrowserRouter>
          <ToastContextProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                          <p className="mt-4 text-text-sub">Đang tải...</p>
                        </div>
                      </div>
                    }
                  >
                    <AppRoutes />
                    <ConditionalChatBox />
                  </Suspense>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </ToastContextProvider>
        </BrowserRouter>
      </ThemeContextProvider>
    </ErrorBoundary>
  )
}

export default App

