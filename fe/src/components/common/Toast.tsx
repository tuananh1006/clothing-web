import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50))
        if (newProgress <= 0) {
          onClose()
          return 0
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [duration, onClose])

  const typeConfig = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40',
      border: 'border-green-200 dark:border-green-700/50',
      text: 'text-green-800 dark:text-green-200',
      iconBg: 'bg-green-500',
      icon: 'check_circle',
      progress: 'bg-green-500',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40',
      border: 'border-red-200 dark:border-red-700/50',
      text: 'text-red-800 dark:text-red-200',
      iconBg: 'bg-red-500',
      icon: 'error',
      progress: 'bg-red-500',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40',
      border: 'border-blue-200 dark:border-blue-700/50',
      text: 'text-blue-800 dark:text-blue-200',
      iconBg: 'bg-blue-500',
      icon: 'info',
      progress: 'bg-blue-500',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/40',
      border: 'border-yellow-200 dark:border-yellow-700/50',
      text: 'text-yellow-800 dark:text-yellow-200',
      iconBg: 'bg-yellow-500',
      icon: 'warning',
      progress: 'bg-yellow-500',
    },
  }

  const config = typeConfig[type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`relative flex items-start gap-4 px-5 py-4 rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm shadow-2xl min-w-[320px] max-w-md ${config.text}`}
      role="alert"
    >
      {/* Icon với background tròn */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center shadow-lg`}>
        <span className="material-symbols-outlined text-white text-xl">
          {config.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold leading-relaxed">{message}</p>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${config.progress} rounded-full`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 dark:hover:bg-black/20 flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </motion.div>
  )
}

export default Toast

