import { Component, ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import { ROUTES } from '@/utils/constants'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
              <span className="material-symbols-outlined text-6xl text-red-500 dark:text-red-400 mb-4">
                error
              </span>
              <h1 className="text-3xl font-bold text-text-main dark:text-white mb-4">
                Đã xảy ra lỗi
              </h1>
              <p className="text-text-sub dark:text-gray-400 mb-6">
                Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-text-sub dark:text-gray-400 mb-2">
                    Chi tiết lỗi (Development)
                  </summary>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={this.handleReset}>Thử lại</Button>
                <Link
                  to={ROUTES.HOME}
                  className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 text-lg"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

