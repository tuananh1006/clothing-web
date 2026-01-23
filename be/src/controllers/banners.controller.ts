import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { getBanners } from '~/services/banners.services'

/**
 * Controller: Lấy danh sách banners (public)
 */
export const getBannersController = async (req: Request, res: Response) => {
  const { position } = req.query

  const result = await getBanners({
    position: position as string,
    is_active: true, // Chỉ lấy banner đang active
    page: 1,
    limit: 100
  })

  return res.status(HTTP_STATUS.OK).json({
    message: 'Get banners success',
    data: result.banners
  })
}
