import { useState, useEffect } from 'react'
import Modal from '@/components/common/Modal'
import Select from '@/components/common/Select'
import Button from '@/components/common/Button'
import { useToast } from '@/contexts/ToastContext'
import { updateOrderStatus } from '@/services/admin.service'
import { OrderStatus } from '@/types'

interface UpdateOrderStatusModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    _id: string
    order_code: string
    status: OrderStatus
  }
  onSuccess?: () => void
}

const STATUS_OPTIONS = [
  { value: OrderStatus.Pending, label: 'Chờ xử lý' },
  { value: OrderStatus.Processing, label: 'Đang xử lý' },
  { value: OrderStatus.Shipping, label: 'Đang giao' },
  { value: OrderStatus.Completed, label: 'Hoàn thành' },
  { value: OrderStatus.Cancelled, label: 'Đã hủy' },
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Chờ xử lý',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Shipping]: 'Đang giao',
  [OrderStatus.Completed]: 'Hoàn thành',
  [OrderStatus.Cancelled]: 'Đã hủy',
}

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
  [OrderStatus.Processing]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
  [OrderStatus.Shipping]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
  [OrderStatus.Completed]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
}

const UpdateOrderStatusModal = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}: UpdateOrderStatusModalProps) => {
  const { showSuccess, showError } = useToast()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status)
  const [isLoading, setIsLoading] = useState(false)

  // Reset selected status when order changes
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status)
    }
  }, [order])

  const handleSubmit = async () => {
    // Validate: không cho chuyển từ cancelled sang status khác
    if (order.status === OrderStatus.Cancelled && selectedStatus !== OrderStatus.Cancelled) {
      showError('Không thể thay đổi trạng thái từ "Đã hủy" sang trạng thái khác')
      return
    }

    // Validate: không cho chọn cùng status hiện tại
    if (selectedStatus === order.status) {
      showError('Vui lòng chọn trạng thái khác với trạng thái hiện tại')
      return
    }

    try {
      setIsLoading(true)
      await updateOrderStatus(order._id, selectedStatus)
      showSuccess(`Đã cập nhật trạng thái đơn hàng ${order.order_code} thành ${STATUS_LABELS[selectedStatus]}`)
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Failed to update order status:', error)
      showError(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setSelectedStatus(order.status)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cập nhật trạng thái đơn hàng"
      size="md"
    >
      <div className="space-y-6">
        {/* Order Info */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-sub dark:text-gray-400">Mã đơn hàng</span>
            <span className="font-bold text-text-main dark:text-white">{order.order_code}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-sub dark:text-gray-400">Trạng thái hiện tại</span>
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${STATUS_BADGE_CLASSES[order.status]}`}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>

        {/* Warning if current status is cancelled */}
        {order.status === OrderStatus.Cancelled && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg">
                warning
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Lưu ý
                </p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Đơn hàng đã bị hủy. Không thể thay đổi sang trạng thái khác.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Select */}
        <div>
          <Select
            label="Trạng thái mới"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            options={STATUS_OPTIONS.map((option) => ({
              ...option,
              disabled:
                order.status === OrderStatus.Cancelled && option.value !== OrderStatus.Cancelled,
            }))}
            disabled={isLoading || order.status === OrderStatus.Cancelled}
          />
          {selectedStatus === order.status && selectedStatus !== OrderStatus.Cancelled && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">info</span>
              Vui lòng chọn trạng thái khác với trạng thái hiện tại
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || selectedStatus === order.status}>
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg mr-2">
                  refresh
                </span>
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UpdateOrderStatusModal

