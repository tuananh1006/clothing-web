interface ColorSelectorProps {
  colors?: string[]
  selectedColor?: string
  onColorChange: (color: string) => void
}

const ColorSelector = ({
  colors,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) => {
  if (!colors || colors.length === 0) {
    return null
  }

  // Map color names to hex codes (you can expand this)
  const colorMap: Record<string, string> = {
    white: '#FFFFFF',
    black: '#000000',
    gray: '#808080',
    red: '#FF0000',
    blue: '#0000FF',
    green: '#008000',
    yellow: '#FFFF00',
    brown: '#A52A2A',
    beige: '#F5F5DC',
    navy: '#000080',
    pink: '#FFC0CB',
  }

  const getColorHex = (colorName: string): string => {
    const normalized = colorName.toLowerCase().trim()
    return colorMap[normalized] || '#CCCCCC'
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-text-main dark:text-gray-200">
        Màu sắc
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color
          const colorHex = getColorHex(color)

          return (
            <button
              key={color}
              type="button"
              onClick={() => onColorChange(color)}
              className={`
                relative flex items-center justify-center rounded-full transition-all
                ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
              title={color}
              aria-label={`Select color ${color}`}
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: colorHex }}
              />
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm drop-shadow-lg">
                    check
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>
      {selectedColor && (
        <p className="text-sm text-text-sub dark:text-gray-400">
          Đã chọn: <span className="font-medium">{selectedColor}</span>
        </p>
      )}
    </div>
  )
}

export default ColorSelector

