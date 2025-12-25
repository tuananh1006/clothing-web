interface SizeSelectorProps {
  sizes?: string[]
  selectedSize?: string
  onSizeChange: (size: string) => void
  error?: string
  quantity?: number
}

const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeChange,
  error,
  quantity = 0,
}: SizeSelectorProps) => {
  if (!sizes || sizes.length === 0) {
    return null
  }

  const isOutOfStock = quantity === 0

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-text-main dark:text-gray-200">
        Kích thước <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size
          const isDisabled = isOutOfStock

          return (
            <button
              key={size}
              type="button"
              onClick={() => !isDisabled && onSizeChange(size)}
              disabled={isDisabled}
              className={`
                px-4 py-2 rounded-lg border-2 font-medium transition-all
                ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111d21] text-text-main dark:text-white hover:border-primary'
                }
                ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }
              `}
            >
              {size}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
      {isOutOfStock && (
        <p className="text-sm text-text-sub dark:text-gray-400">
          Sản phẩm đã hết hàng
        </p>
      )}
    </div>
  )
}

export default SizeSelector

