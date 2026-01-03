import { useState, useRef } from 'react'

interface LogoUploadProps {
  currentLogoUrl?: string | null
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number // in MB
  disabled?: boolean
}

const LogoUpload = ({
  currentLogoUrl,
  onFileSelect,
  accept = 'image/*',
  maxSize = 2,
  disabled = false,
}: LogoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File quá lớn. Kích thước tối đa: ${maxSize}MB`)
      return
    }

    // Check file type
    if (accept.includes('image/*')) {
      if (!file.type.startsWith('image/')) {
        setError('File phải là hình ảnh')
        return
      }
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    onFileSelect(file)
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const displayPreview = preview || currentLogoUrl

  return (
    <div className="flex flex-col items-center">
      <div
        className={`size-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors mb-3 group relative overflow-hidden ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${displayPreview ? 'border-gray-300 dark:border-gray-700' : ''}`}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        {displayPreview ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${displayPreview})` }}
            />
            <img
              src={displayPreview}
              alt="Logo preview"
              className="absolute inset-0 w-full h-full object-cover rounded-full z-0"
            />
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary z-10 relative">
              cloud_upload
            </span>
            <span className="text-xs text-gray-500 group-hover:text-primary mt-1 z-10 relative">
              Tải lên Logo
            </span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary z-10">
              cloud_upload
            </span>
            <span className="text-xs text-gray-500 group-hover:text-primary mt-1 z-10">
              Tải lên Logo
            </span>
          </>
        )}
      </div>
      <p className="text-xs text-text-sub text-center">
        Định dạng: .png, .jpg
        <br />
        Kích thước tối đa: {maxSize}MB
      </p>
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>}
    </div>
  )
}

export default LogoUpload

