import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, X, Upload } from 'lucide-react'
import Button from '@/components/common/Button'
import { useToast } from '@/contexts/ToastContext'
import { createReview, updateReview } from '@/services/reviews.service'
import type { CreateReviewData, UpdateReviewData, Review } from '@/types/review.types'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Vui lòng chọn đánh giá').max(5),
  comment: z.string().max(1000, 'Bình luận không được vượt quá 1000 ký tự').optional(),
  images: z.array(z.string().url('URL ảnh không hợp lệ')).max(5, 'Tối đa 5 ảnh').optional()
})

interface ReviewFormProps {
  product_id: string
  order_id?: string
  existingReview?: Review
  onSuccess?: () => void
  onCancel?: () => void
}

const ReviewForm = ({ product_id, order_id, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
  const { showSuccess, showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(existingReview?.rating || 0)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(existingReview?.images || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<{ rating: number; comment?: string; images?: string[] }>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
      images: existingReview?.images || []
    }
  })

  const comment = watch('comment')

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    setValue('rating', rating, { shouldValidate: true })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: File[] = []
    const newPreviews: string[] = []

    const totalImages = existingImages.length + imageFiles.length
    if (totalImages + files.length > 5) {
      showError(`Tối đa 5 ảnh. Hiện tại có ${totalImages} ảnh.`)
      e.target.value = ''
      return
    }

    Array.from(files).forEach((file) => {

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Chỉ chấp nhận file ảnh')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Kích thước file không được vượt quá 5MB')
        return
      }

      newFiles.push(file)
      const preview = URL.createObjectURL(file)
      newPreviews.push(preview)
    })

    setImageFiles([...imageFiles, ...newFiles])
    setImagePreviews([...imagePreviews, ...newPreviews])
    e.target.value = '' // Reset input
  }

  const handleRemoveImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Revoke object URL to free memory
    if (index < imagePreviews.length && !existingReview?.images?.includes(imagePreviews[index])) {
      URL.revokeObjectURL(imagePreviews[index])
    }
    
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const handleRemoveExistingImage = (index: number) => {
    const newImages = existingImages.filter((_, i) => i !== index)
    setExistingImages(newImages)
  }

  const handleRemoveNewImage = (index: number) => {
    handleRemoveImage(index)
  }

  const onSubmit = async (data: { rating: number; comment?: string; images?: string[] }) => {
    if (selectedRating === 0) {
      showError('Vui lòng chọn đánh giá')
      return
    }

    try {
      setIsSubmitting(true)

      if (existingReview) {
        // Update existing review - use selectedRating instead of data.rating
        // Combine existing images (that weren't removed) with new uploaded images
        const finalImages = existingImages.length > 0 ? existingImages : undefined
        const updateData: UpdateReviewData = {
          rating: selectedRating, // Use selectedRating from state
          comment: data.comment || undefined,
          images: finalImages // Keep existing images that weren't removed
        }
        await updateReview(existingReview._id, updateData, imageFiles.length > 0 ? imageFiles : undefined)
        showSuccess('Đã cập nhật đánh giá thành công')
      } else {
        // Create new review - use selectedRating instead of data.rating
        const createData: CreateReviewData = {
          product_id,
          order_id,
          rating: selectedRating, // Use selectedRating from state
          comment: data.comment || undefined,
          images: [] // Images will be uploaded via files
        }
        await createReview(createData, imageFiles.length > 0 ? imageFiles : undefined)
        showSuccess('Đã gửi đánh giá thành công')
      }

      onSuccess?.()
    } catch (error: any) {
      console.error('Error submitting review:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Không thể gửi đánh giá'
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Rating Selection */}
      <div>
        <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
          Đánh giá của bạn <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  rating <= selectedRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
          {selectedRating > 0 && (
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedRating} / 5 sao
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-500">{errors.rating.message}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="block text-sm font-semibold text-text-main dark:text-white mb-2">
          Bình luận (tùy chọn)
        </label>
        <textarea
          id="comment"
          {...register('comment')}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        />
        <div className="flex items-center justify-between mt-1">
          {errors.comment && (
            <p className="text-sm text-red-500">{errors.comment.message}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {comment?.length || 0} / 1000 ký tự
          </p>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
          Ảnh đánh giá (tùy chọn, tối đa 5 ảnh)
        </label>
        <div className="mb-3">
          <input
            type="file"
            id="review-images"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            disabled={existingImages.length + imageFiles.length >= 5}
          />
          <label
            htmlFor="review-images"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-primary transition-colors ${
              imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {existingImages.length + imageFiles.length >= 5 ? 'Đã đạt tối đa 5 ảnh' : 'Chọn ảnh để upload'}
            </span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Chấp nhận: JPG, PNG, GIF, WebP (tối đa 5MB mỗi ảnh)
          </p>
        </div>

        {/* Existing Images (when editing) */}
        {existingReview && existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ảnh hiện tại:</p>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <img
                    src={image}
                    alt={`Existing image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <div>
            {existingReview && existingImages.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ảnh mới:</p>
            )}
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {errors.images && (
          <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting || selectedRating === 0}>
          {isSubmitting ? 'Đang gửi...' : existingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  )
}

export default ReviewForm

