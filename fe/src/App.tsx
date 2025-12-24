import { BrowserRouter, useRoutes } from 'react-router-dom'
import { Suspense } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { routes } from './routes'

const AppRoutes = () => {
  const element = useRoutes(routes)
  return element
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

