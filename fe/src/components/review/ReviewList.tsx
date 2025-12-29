import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import ReviewItem from './ReviewItem'
import ReviewForm from './ReviewForm'
import RatingDisplay from './RatingDisplay'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import { getProductReviews } from '@/services/reviews.service'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/contexts/ToastContext'
import type { ProductReviewsResponse, Review } from '@/types/review.types'

interface ReviewListProps {
  product_id: string
  product_name?: string
  onReviewUpdate?: () => void // Callback khi review được tạo/cập nhật
}

const ReviewList = ({ product_id, product_name, onReviewUpdate }: ReviewListProps) => {
  const { isAuthenticated, user: currentUser } = useAuth()
  const { showError } = useToast()
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  // Kiểm tra xem user hiện tại đã có review cho sản phẩm này chưa
  const hasUserReviewed = reviewsData?.reviews.some(
    (review) =>
      currentUser?._id &&
      (review.user_id === currentUser._id || review.user_id?.toString() === currentUser._id?.toString())
  ) || false

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const data = await getProductReviews(product_id, page, 10, sortBy)
      setReviewsData(data)
    } catch (error: any) {
      console.error('Error fetching reviews:', error)
      showError('Không thể tải đánh giá')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [product_id, page, sortBy])

  const handleReviewSuccess = () => {
    // Đóng form ngay lập tức
    setShowReviewForm(false)
    setEditingReview(null)
    
    // Refresh reviews
    fetchReviews()
    
    // Thông báo cho parent component để refresh product data (rating, etc.)
    onReviewUpdate?.()
    
    // Scroll đến phần reviews sau một chút để user thấy review mới
    setTimeout(() => {
      const reviewsSection = document.querySelector('[data-reviews-section]')
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setShowReviewForm(true)
  }

  const handleDeleteReview = () => {
    fetchReviews()
  }

  const totalReviews = reviewsData?.pagination.total || 0
  const totalPages = reviewsData?.pagination.total_page || 0
  const ratingDistribution = reviewsData?.rating_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  // Calculate average rating
  const totalRatings = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0)
  const averageRating =
    totalRatings > 0
      ? (ratingDistribution[5] * 5 +
          ratingDistribution[4] * 4 +
          ratingDistribution[3] * 3 +
          ratingDistribution[2] * 2 +
          ratingDistribution[1] * 1) /
        totalRatings
      : 0

  return (
    <div className="mt-12" data-reviews-section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-main dark:text-white">
          Đánh giá sản phẩm {product_name && `"${product_name}"`}
        </h2>
        {isAuthenticated && !showReviewForm && !hasUserReviewed && (
          <Button onClick={() => setShowReviewForm(true)}>
            {totalReviews === 0 ? 'Viết đánh giá đầu tiên' : 'Viết đánh giá'}
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-main dark:text-white">
              {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}
            </h3>
            <button
              onClick={() => {
                setShowReviewForm(false)
                setEditingReview(null)
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <ReviewForm
            product_id={product_id}
            existingReview={editingReview || undefined}
            onSuccess={handleReviewSuccess}
            onCancel={() => {
              setShowReviewForm(false)
              setEditingReview(null)
            }}
          />
        </div>
      )}

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-text-main dark:text-white mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <RatingDisplay rating={averageRating} size="lg" showNumber={false} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {totalReviews} đánh giá
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution]
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sort and Filter */}
      {totalReviews > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'newest' | 'helpful' | 'rating')
                setPage(1)
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Mới nhất</option>
              <option value="helpful">Hữu ích nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="w-full h-32 rounded-lg" />
          ))}
        </div>
      ) : reviewsData && reviewsData.reviews.length > 0 ? (
        <>
          <div className="space-y-6">
            {reviewsData.reviews.map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onMarkHelpful={fetchReviews}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isAuthenticated
              ? 'Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!'
              : 'Chưa có đánh giá nào cho sản phẩm này.'}
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Đăng nhập để viết đánh giá
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ReviewList

