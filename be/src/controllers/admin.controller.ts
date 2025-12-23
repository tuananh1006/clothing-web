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
