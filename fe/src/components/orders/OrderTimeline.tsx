import { OrderStatus } from '@/types'

interface Props {
  currentStatus: OrderStatus
}

const STEPS = [
  {
    status: OrderStatus.Pending,
    label: 'Đã đặt',
    icon: 'check'
  },
  {
    status: OrderStatus.Processing,
    label: 'Đã xác nhận',
    icon: 'check'
  },
  {
    status: OrderStatus.Shipping,
    label: 'Đang giao',
    icon: 'local_shipping'
  },
  {
    status: OrderStatus.Completed,
    label: 'Đã giao',
    icon: 'inventory'
  }
]

const OrderTimeline = ({ currentStatus }: Props) => {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus)

  const isCancelled = currentStatus === OrderStatus.Cancelled

  return (
    <div className="bg-white dark:bg-[#1a2c32] rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6">
      <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
        Trạng thái đơn hàng
      </h2>

      {/* Timeline */}
      <div className="relative flex items-center justify-between w-full px-2">
        {/* Background line */}
        <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />

        {/* Active line */}
        {!isCancelled && currentIndex >= 0 && (
          <div
            className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-primary rounded-full transition-all"
            style={{
              width: `${(currentIndex / (STEPS.length - 1)) * 100}%`
            }}
          />
        )}

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return (
            <div
              key={step.status}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center shadow-md
                  ${
                    isCompleted || isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }
                  ${isActive ? 'ring-4 ring-primary/20' : ''}
                `}
              >
                <span className="material-symbols-outlined text-sm">
                  {step.icon}
                </span>
              </div>

              <span
                className={`
                  text-xs font-bold hidden sm:block
                  ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-text-main dark:text-white'
                      : 'text-gray-400'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Cancelled state */}
      {isCancelled && (
        <div className="mt-6 flex items-center gap-2 text-red-500 font-bold">
          <span className="material-symbols-outlined">close</span>
          Đơn hàng đã bị hủy
        </div>
      )}
    </div>
  )
}

export default OrderTimeline
