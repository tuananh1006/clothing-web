import { Request, Response } from 'express'
import categoriesService from '~/services/categories.services'
import HTTP_STATUS from '~/constants/httpStatus'

export const getCategoriesController = async (req: Request, res: Response) => {
  const { is_featured, limit } = req.query
  const result = await categoriesService.getCategories({
    is_featured: is_featured === 'true',
    limit: limit ? Number(limit) : undefined
  })
  return res.status(HTTP_STATUS.OK).json({
    message: 'Get categories success',
    data: result
  })
}
