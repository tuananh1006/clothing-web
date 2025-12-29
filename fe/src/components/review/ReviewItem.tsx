import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ThumbsUp, Edit, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import RatingDisplay from './RatingDisplay'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import { deleteReview, markHelpful } from '@/services/reviews.service'
import type { Review } from '@/types/review.types'

interface ReviewItemProps {
  review: Review
  onEdit?: (review: Review) => void
  onDelete?: () => void
  onMarkHelpful?: () => void
}

const ReviewItem = ({ review, onEdit, onDelete }: ReviewItemProps) => {
  const { user: currentUser } = useAuth()
  const { showSuccess, showError } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false)
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(
    currentUser?._id && review.helpful_users?.includes(currentUser._id) || false
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Check if current user owns this review
  // user from AuthContext is User | null, not { user: User }
  const isOwnReview = currentUser?._id === review.user_id || 
                      currentUser?._id?.toString() === review.user_id?.toString()
  
  // Update hasMarkedHelpful when review or currentUser changes
  useEffect(() => {
    setHasMarkedHelpful(currentUser?._id && review.helpful_users?.includes(currentUser._id) || false)
    setHelpfulCount(review.helpful_count)
  }, [review.helpful_users, review.helpful_count, currentUser?._id])

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteReview(review._id)
      showSuccess('Đã xóa đánh giá thành công')
      onDelete?.()
    } catch (error: any) {
      console.error('Error deleting review:', error)
      showError(error.response?.data?.message || 'Không thể xóa đánh giá')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleMarkHelpful = async () => {
    if (!currentUser) {
      showError('Vui lòng đăng nhập để đánh dấu hữu ích')
      return
    }

    try {
      setIsMarkingHelpful(true)
      const newHelpfulState = !hasMarkedHelpful
      const response = await markHelpful(review._id, newHelpfulState)
      
      // Update count from response
      if (response.data?.helpful_count !== undefined) {
        setHelpfulCount(response.data.helpful_count)
      } else {
        // Fallback: update locally
        setHelpfulCount((prev) => newHelpfulState ? prev + 1 : Math.max(0, prev - 1))
      }
      
      showSuccess(newHelpfulState ? 'Đã đánh dấu hữu ích' : 'Đã bỏ đánh dấu hữu ích')
      
      // Update local state immediately
      setHasMarkedHelpful(newHelpfulState)
      
      // Optionally update parent component without full refetch
      // onMarkHelpful?.() // Commented out to avoid full reload
    } catch (error: any) {
      console.error('Error marking helpful:', error)
      showError(error.response?.data?.message || 'Không thể đánh dấu hữu ích')
    } finally {
      setIsMarkingHelpful(false)
    }
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleCloseImageModal = () => {
    setSelectedImageIndex(null)
  }

  const goToPreviousImage = () => {
    if (selectedImageIndex !== null && review.images) {
      setSelectedImageIndex(
        selectedImageIndex > 0 ? selectedImageIndex - 1 : review.images.length - 1
      )
    }
  }

  const goToNextImage = () => {
    if (selectedImageIndex !== null && review.images) {
      setSelectedImageIndex(
        selectedImageIndex < review.images.length - 1 ? selectedImageIndex + 1 : 0
      )
    }
  }

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    goToPreviousImage()
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    goToNextImage()
  }

  // Handle keyboard navigation in image modal
  useEffect(() => {
    if (selectedImageIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousImage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextImage()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCloseImageModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, review.images])

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {review.user?.avatar_url ? (
              <img src={review.user.avatar_url} alt={review.user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                {review.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white">{review.user?.name || 'Người dùng'}</span>
              <RatingDisplay rating={review.rating} size="sm" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: vi })}
            </p>
          </div>
        </div>

        {isOwnReview && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(review)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {review.comment && (
        <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{review.comment}</p>
      )}

      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(index)}
              tabIndex={0}
              role="button"
              aria-label={`Xem hình ảnh ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleImageClick(index)
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImageIndex !== null && review.images && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={handleCloseImageModal}
          role="dialog"
          aria-modal="true"
          aria-label="Xem hình ảnh đánh giá"
        >
          {/* Close Button */}
          <button
            onClick={handleCloseImageModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Đóng"
            tabIndex={0}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {review.images.length > 1 && (
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Hình ảnh trước"
              tabIndex={0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {review.images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Hình ảnh tiếp theo"
              tabIndex={0}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image Counter */}
          {review.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm z-10">
              {selectedImageIndex + 1} / {review.images.length}
            </div>
          )}

          {/* Main Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={review.images[selectedImageIndex]}
              alt={`Review image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleMarkHelpful}
          disabled={isMarkingHelpful}
          className={`flex items-center gap-1 text-sm transition-colors disabled:opacity-50 ${
            hasMarkedHelpful
              ? 'text-primary dark:text-primary font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasMarkedHelpful ? 'fill-current' : ''}`} />
          <span>Hữu ích ({helpfulCount})</span>
        </button>
      </div>
    </div>
  )
}

export default ReviewItem

