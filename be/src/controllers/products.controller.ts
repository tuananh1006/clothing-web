import { Request, Response } from 'express'
import productsService from '~/services/products.services'
import HTTP_STATUS from '~/constants/httpStatus'

export const getProductsController = async (req: Request, res: Response) => {
  const { page, limit, category_slug, name, sort_by, order, price_min, price_max, rating_filter, is_featured } =
    req.query
  const result = await productsService.getProducts({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    category_slug: category_slug as string,
    name: name as string,
    sort_by: sort_by as any,
    order: order as any,
    price_min: price_min ? Number(price_min) : undefined,
    price_max: price_max ? Number(price_max) : undefined,
    rating_filter: rating_filter ? Number(rating_filter) : undefined,
    is_featured: is_featured === 'true' || is_featured === '1'
  })
  return res.status(HTTP_STATUS.OK).json({
    message: 'Get products success',
    data: result
  })
}

export const getProductDetailController = async (req: Request, res: Response) => {
  const { slug } = req.params
  const result = await productsService.getProductDetail(slug)
  if (!result) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: 'Product not found'
    })
  }
  return res.status(HTTP_STATUS.OK).json({
    message: 'Get product detail success',
    data: result
  })
}

export const getRelatedProductsController = async (req: Request, res: Response) => {
  const { slug } = req.params
  const { limit } = req.query
  const result = await productsService.getRelatedProducts(slug, Number(limit) || 4)
  return res.status(HTTP_STATUS.OK).json({
    message: 'Get related products success',
    data: result
  })
}
