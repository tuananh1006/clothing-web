// Format functions

/**
 * Format số tiền thành chuỗi VNĐ
 * @param amount - Số tiền cần format
 * @returns Chuỗi đã format (ví dụ: "1.000.000 ₫")
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Format số tiền đơn giản (không có ký hiệu VNĐ)
 * @param amount - Số tiền cần format
 * @returns Chuỗi đã format (ví dụ: "1.000.000")
 */
export const formatPriceSimple = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

/**
 * Format ngày tháng
 * @param date - Date object hoặc string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Chuỗi ngày tháng đã format
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('vi-VN', options || defaultOptions).format(dateObj)
}

/**
 * Format ngày tháng ngắn gọn
 * @param date - Date object hoặc string
 * @returns Chuỗi ngày tháng (ví dụ: "24/12/2024")
 */
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj)
}

/**
 * Format thời gian (giờ:phút)
 * @param date - Date object hoặc string
 * @returns Chuỗi thời gian (ví dụ: "14:30")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Format số lượng (thêm dấu phẩy)
 * @param number - Số cần format
 * @returns Chuỗi đã format (ví dụ: "1.000")
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('vi-VN').format(number)
}

/**
 * Rút gọn chuỗi với ellipsis
 * @param text - Chuỗi cần rút gọn
 * @param maxLength - Độ dài tối đa
 * @returns Chuỗi đã rút gọn
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Format số lớn thành dạng rút gọn (ví dụ: 345200000 -> "345.2M")
 * @param num - Số cần format
 * @returns Chuỗi đã format (ví dụ: "345.2M", "1.5B", "2.3K")
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/**
 * Format địa chỉ từ string format "address, ward_id, district_id, province_id"
 * Parse và trả về các phần của địa chỉ
 * @param addressString - Chuỗi địa chỉ cần format
 * @returns Object chứa các phần của địa chỉ
 */
export const parseAddress = (addressString: string | undefined | null): {
  address: string
  ward_id: string
  district_id: string
  province_id: string
} | null => {
  if (!addressString) return null
  
  // Parse địa chỉ: format là "address, ward_id, district_id, province_id"
  const parts = addressString.split(',').map(part => part.trim())
  
  // Nếu có 4 phần (address, ward_id, district_id, province_id)
  if (parts.length >= 4) {
    return {
      address: parts[0],
      ward_id: parts[1],
      district_id: parts[2],
      province_id: parts[3]
    }
  }
  
  // Nếu không đúng format, trả về null
  return null
}

/**
 * Format địa chỉ từ string format "address, ward_id, district_id, province_id"
 * Chỉ hiển thị phần địa chỉ cụ thể, bỏ các ID (fallback)
 * @param addressString - Chuỗi địa chỉ cần format
 * @returns Chuỗi địa chỉ đã format (chỉ phần địa chỉ cụ thể)
 */
export const formatAddress = (addressString: string | undefined | null): string => {
  const parsed = parseAddress(addressString)
  if (parsed) {
    return parsed.address
  }
  return addressString || ''
}

