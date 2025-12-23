import { Request, Response } from 'express'
import adminService from '~/services/admin.services'

export const dashboardStatsController = async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query
  const data = await adminService.getDashboardStats({
    start_date: start_date as string,
    end_date: end_date as string
  })
  return res.json({ message: 'Get dashboard stats successfully', data })
}

export const revenueChartController = async (req: Request, res: Response) => {
  const { start_date, end_date, days } = req.query
  const data = await adminService.getRevenueChart({
    start_date: start_date as string,
    end_date: end_date as string,
    days: days ? Number(days) : undefined
  })
  return res.json({ message: 'Get revenue chart successfully', data })
}

export const statsOverviewController = async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query
  const data = await adminService.getStatsOverview({
    start_date: start_date as string,
    end_date: end_date as string
  })
  return res.json({ message: 'Get stats overview successfully', data })
}

export const adminGetProductsController = async (req: Request, res: Response) => {
  const { page, limit, keyword, category_id, status, sort_by, order } = req.query
  const data = await adminService.getAdminProducts({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    keyword: keyword as string,
    category_id: category_id as string,
    status: status as any,
    sort_by: sort_by as string,
    order: order as any
  })
  return res.json({ message: 'Get admin products successfully', data })
}

export const adminGetProductsMetadataController = async (req: Request, res: Response) => {
  const data = await adminService.getAdminProductsMetadata()
  return res.json({ message: 'Get admin products metadata successfully', data })
}

export const adminGetProductDetailController = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await adminService.getAdminProductDetail(id)
  if (!data) return res.status(404).json({ message: 'Product not found' })
  return res.json({ message: 'Get admin product detail successfully', data })
}

export const adminUpdateProductController = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await adminService.updateAdminProduct(id, req.body)
  return res.json({ message: 'Update admin product successfully', data })
}

export const adminDeleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await adminService.deleteAdminProduct(id)
  return res.json({ message: data.message })
}

export const adminOrdersStatsController = async (req: Request, res: Response) => {
  const data = await adminService.getAdminOrderStats()
  return res.json({ message: 'Get admin order stats successfully', data })
}

export const adminGetOrdersController = async (req: Request, res: Response) => {
  const { page, limit, keyword, status, date_from, date_to, sort_by, order } = req.query
  const data = await adminService.getAdminOrders({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    keyword: keyword as string,
    status: status as any,
    date_from: date_from as string,
    date_to: date_to as string,
    sort_by: sort_by as string,
    order: order as any
  })
  return res.json({ message: 'Get admin orders successfully', data })
}

export const adminGetCustomersController = async (req: Request, res: Response) => {
  const { page, limit, keyword, status, sort_by, order } = req.query
  const data = await adminService.getAdminCustomers({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    keyword: keyword as string,
    status: status as any,
    sort_by: sort_by as any,
    order: order as any
  })
  return res.json({ message: 'Get admin customers successfully', data })
}

export const adminGetCustomerDetailController = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = await adminService.getAdminCustomerDetail(id)
  if (!data) return res.status(404).json({ message: 'Customer not found' })
  return res.json({ message: 'Get admin customer detail successfully', data })
}

export const adminUpdateCustomerStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body as { status: 'active' | 'inactive' }
  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }
  const data = await adminService.updateAdminCustomerStatus(id, status)
  return res.json({ message: data.message })
}
