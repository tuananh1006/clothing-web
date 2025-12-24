interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

const Skeleton = ({
  className = '',
  variant = 'rectangular',
}: SkeletonProps) => {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700'

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label="Loading..."
    />
  )
}

export default Skeleton

