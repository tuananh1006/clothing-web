import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Banner from '~/models/schemas/Banner.schema'
import HTTP_STATUS from '~/constants/httpStatus'

/**
 * Tạo banner mới
 */
export const createBanner = async (bannerData: {
  title: string
  subtitle?: string
  image_url: string
  alt_text?: string
  cta_text?: string
  cta_link?: string
  order?: number
  position: string
  is_active?: boolean
}) => {
  const banner = new Banner({
    title: bannerData.title,
    subtitle: bannerData.subtitle || '',
    image_url: bannerData.image_url,
    alt_text: bannerData.alt_text || '',
    cta_text: bannerData.cta_text || '',
    cta_link: bannerData.cta_link || '',
    order: bannerData.order || 0,
    position: bannerData.position,
    is_active: bannerData.is_active !== undefined ? bannerData.is_active : true,
    created_at: new Date(),
    updated_at: new Date()
  })

  const result = await databaseServices.banners.insertOne(banner)
  const insertedBanner = await databaseServices.banners.findOne({ _id: result.insertedId })
  return insertedBanner
}

/**
 * Lấy danh sách banners với filter và pagination
 */
export const getBanners = async (filters: {
  position?: string
  is_active?: boolean
  page?: number
  limit?: number
}) => {
  const { position, is_active, page = 1, limit = 100 } = filters
  const skip = (page - 1) * limit

  const query: any = {}
  if (position) {
    query.position = position
  }
  if (is_active !== undefined) {
    query.is_active = is_active
  }

  const [banners, total] = await Promise.all([
    databaseServices.banners
      .find(query)
      .sort({ order: 1, created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    databaseServices.banners.countDocuments(query)
  ])

  return {
    banners,
    pagination: {
      page,
      limit,
      total,
      total_page: Math.ceil(total / limit)
    }
  }
}

/**
 * Lấy banner theo ID
 */
export const getBannerById = async (bannerId: string) => {
  const banner = await databaseServices.banners.findOne({ _id: new ObjectId(bannerId) })
  if (!banner) {
    throw new Error('Banner not found')
  }
  return banner
}

/**
 * Cập nhật banner
 */
export const updateBanner = async (
  bannerId: string,
  updateData: {
    title?: string
    subtitle?: string
    image_url?: string
    alt_text?: string
    cta_text?: string
    cta_link?: string
    order?: number
    position?: string
    is_active?: boolean
  }
) => {
  const updateFields: any = {
    updated_at: new Date()
  }

  if (updateData.title !== undefined) updateFields.title = updateData.title
  if (updateData.subtitle !== undefined) updateFields.subtitle = updateData.subtitle
  if (updateData.image_url !== undefined) updateFields.image_url = updateData.image_url
  if (updateData.alt_text !== undefined) updateFields.alt_text = updateData.alt_text
  if (updateData.cta_text !== undefined) updateFields.cta_text = updateData.cta_text
  if (updateData.cta_link !== undefined) updateFields.cta_link = updateData.cta_link
  if (updateData.order !== undefined) updateFields.order = updateData.order
  if (updateData.position !== undefined) updateFields.position = updateData.position
  if (updateData.is_active !== undefined) updateFields.is_active = updateData.is_active

  const result = await databaseServices.banners.findOneAndUpdate(
    { _id: new ObjectId(bannerId) },
    { $set: updateFields },
    { returnDocument: 'after' }
  )

  if (!result) {
    throw new Error('Banner not found')
  }

  return result
}

/**
 * Xóa banner
 */
export const deleteBanner = async (bannerId: string) => {
  const result = await databaseServices.banners.findOneAndDelete({ _id: new ObjectId(bannerId) })
  if (!result) {
    throw new Error('Banner not found')
  }
  return result
}

