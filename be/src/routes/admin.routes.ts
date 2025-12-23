import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { requireAdmin } from '~/middlewares/admin.middleware'
import {
  dashboardStatsController,
  revenueChartController,
  statsOverviewController
} from '~/controllers/admin.controller'
import { wrapRequestHandler } from '~/utils/handler'

const adminRouter = Router()

/**
 * Description: Admin Dashboard Stats
 * Path: /dashboard/stats
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date? }
 */
adminRouter.get('/dashboard/stats', accessTokenValidator, requireAdmin, wrapRequestHandler(dashboardStatsController))

/**
 * Description: Admin Revenue Chart
 * Path: /dashboard/revenue-chart
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date?, days? }
 */
adminRouter.get(
  '/dashboard/revenue-chart',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(revenueChartController)
)

export default adminRouter
/**
 * Description: Admin Stats Overview
 * Path: /stats/overview
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date? }
 */
adminRouter.get('/stats/overview', accessTokenValidator, requireAdmin, wrapRequestHandler(statsOverviewController))
