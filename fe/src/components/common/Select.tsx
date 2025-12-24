import { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-text-main dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full
          px-4
          py-3
          rounded-lg
          border
          ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
          bg-white dark:bg-[#111d21]
          text-text-main dark:text-white
          focus:ring-2 focus:ring-primary focus:border-transparent
          outline-none
          transition-all
          text-sm
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Select

