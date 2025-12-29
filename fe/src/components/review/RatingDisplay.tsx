import { Star } from 'lucide-react'

interface RatingDisplayProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  className?: string
}

const RatingDisplay = ({ rating, maxRating = 5, size = 'md', showNumber = false, className = '' }: RatingDisplayProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const filledStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - filledStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: filledStars }).map((_, i) => (
          <Star key={`filled-${i}`} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <Star
              className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400 absolute top-0 left-0 overflow-hidden`}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
        ))}
      </div>
      {showNumber && <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}

export default RatingDisplay

