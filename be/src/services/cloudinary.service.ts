import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import { config } from 'dotenv'

config()

// Parse Cloudinary URL: cloudinary://api_key:api_secret@cloud_name
const parseCloudinaryUrl = (url: string) => {
  const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/)
  if (!match) {
    throw new Error('Invalid Cloudinary URL format')
  }
  return {
    api_key: match[1],
    api_secret: match[2],
    cloud_name: match[3]
  }
}

// Initialize Cloudinary
const initCloudinary = () => {
  try {
    if (process.env.CLOUDINARY_URL) {
      const { api_key, api_secret, cloud_name } = parseCloudinaryUrl(process.env.CLOUDINARY_URL)
      cloudinary.config({
        cloud_name,
        api_key,
        api_secret
      })
      console.log('Cloudinary initialized with CLOUDINARY_URL')
    } else if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })
      console.log('Cloudinary initialized with individual variables')
    } else {
      console.warn('Cloudinary not configured. Image uploads will fail.')
      console.warn('Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')
    }
  } catch (error) {
    console.error('Error initializing Cloudinary:', error)
  }
}

initCloudinary()

class CloudinaryService {
  /**
   * Upload image buffer to Cloudinary
   */
  async uploadImage(
    buffer: Buffer,
    folder: string = 'reviews',
    options: {
      width?: number
      height?: number
      crop?: string
      format?: string
      quality?: number
    } = {}
  ): Promise<{ url: string; public_id: string; secure_url: string }> {
    return new Promise((resolve, reject) => {
      // Check if Cloudinary is configured
      const config = cloudinary.config()
      if (!config.cloud_name) {
        return reject(new Error('Cloudinary is not configured. Please set CLOUDINARY_URL or CLOUDINARY_* environment variables.'))
      }

      const uploadOptions = {
        folder,
        resource_type: 'image' as const,
        ...options
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(new Error(`Cloudinary upload failed: ${error.message}`))
          } else if (result) {
            resolve({
              url: result.url,
              public_id: result.public_id,
              secure_url: result.secure_url
            })
          } else {
            reject(new Error('Upload failed: No result from Cloudinary'))
          }
        }
      )

      // Convert buffer to stream
      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)
      readable.pipe(uploadStream)
    })
  }

  /**
   * Upload multiple images
   */
  async uploadImages(
    buffers: Buffer[],
    folder: string = 'reviews'
  ): Promise<Array<{ url: string; public_id: string; secure_url: string }>> {
    const uploadPromises = buffers.map((buffer) => this.uploadImage(buffer, folder))
    return Promise.all(uploadPromises)
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(public_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Delete multiple images
   */
  async deleteImages(public_ids: string[]): Promise<void> {
    const deletePromises = public_ids.map((public_id) => this.deleteImage(public_id))
    await Promise.all(deletePromises)
  }
}

export default new CloudinaryService()

