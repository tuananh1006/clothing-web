import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import {
  requireAdmin,
  updateProductValidator,
  updateCustomerStatusValidator,
  updateOrderStatusValidator,
  updateSettingsGeneralValidator
} from '~/middlewares/admin.middleware'
import {
  dashboardStatsController,
  revenueChartController,
  statsOverviewController,
  categoryRevenueController,
  topProductsController,
  dailyRevenueController,
  orderStatusDistributionController,
  adminCreateProductController,
  adminGetProductsController,
  adminGetProductsMetadataController,
  adminGetProductDetailController,
  adminUpdateProductController,
  adminDeleteProductController,
  adminOrdersStatsController,
  adminGetOrdersController,
  adminUpdateOrderStatusController,
  adminGetCustomersController,
  adminGetCustomerDetailController,
  adminUpdateCustomerStatusController,
  adminGetSettingsController,
  adminUpdateSettingsGeneralController,
  adminUpdateSettingsLogoController,
  adminUpdateSettingsPaymentController,
  adminUpdateSettingsShippingController
} from '~/controllers/admin.controller'

// Settings routes are appended after customer routes
import { wrapRequestHandler } from '~/utils/handler'
import { uploadLogo } from '~/middlewares/upload.middleware'

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

/**
 * Description: Admin - List products
 * Path: /products
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { page?, limit?, keyword?, category_id?, status?, sort_by?, order? }
 */
adminRouter.get('/products', accessTokenValidator, requireAdmin, wrapRequestHandler(adminGetProductsController))

/**
 * Description: Admin - Create product
 * Path: /products
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
adminRouter.post(
  '/products',
  accessTokenValidator,
  requireAdmin,
  updateProductValidator,
  wrapRequestHandler(adminCreateProductController)
)

/**
 * Description: Admin - Products metadata (filters)
 * Path: /products/metadata
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
adminRouter.get(
  '/products/metadata',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(adminGetProductsMetadataController)
)

/**
 * Description: Admin - Product detail (for edit)
 * Path: /products/:id
 * Method: GET
 */
adminRouter.get(
  '/products/:id',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(adminGetProductDetailController)
)

/**
 * Description: Admin - Update product
 * Path: /products/:id
 * Method: PUT
 */
adminRouter.put(
  '/products/:id',
  accessTokenValidator,
  requireAdmin,
  updateProductValidator,
  wrapRequestHandler(adminUpdateProductController)
)

/**
 * Description: Admin - Delete product (soft delete)
 * Path: /products/:id
 * Method: DELETE
 */
adminRouter.delete(
  '/products/:id',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(adminDeleteProductController)
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

/**
 * Description: Admin Category Revenue (for pie chart)
 * Path: /dashboard/category-revenue
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date? }
 */
adminRouter.get(
  '/dashboard/category-revenue',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(categoryRevenueController)
)

/**
 * Description: Admin Top Products (for top products list)
 * Path: /dashboard/top-products
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date?, limit? }
 */
adminRouter.get(
  '/dashboard/top-products',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(topProductsController)
)

/**
 * Description: Admin Daily Revenue
 * Path: /dashboard/daily-revenue
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date?, limit? }
 */
adminRouter.get(
  '/dashboard/daily-revenue',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(dailyRevenueController)
)

/**
 * Description: Admin Order Status Distribution
 * Path: /dashboard/order-status-distribution
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { start_date?, end_date? }
 */
adminRouter.get(
  '/dashboard/order-status-distribution',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(orderStatusDistributionController)
)

/**
 * Description: Admin - Order stats
 * Path: /orders/stats
 * Method: GET
 */
adminRouter.get('/orders/stats', accessTokenValidator, requireAdmin, wrapRequestHandler(adminOrdersStatsController))

/**
 * Description: Admin - List orders
 * Path: /orders
 * Method: GET
 * Query: { page?, limit?, keyword?, status?, date_from?, date_to?, sort_by?, order? }
 */
adminRouter.get('/orders', accessTokenValidator, requireAdmin, wrapRequestHandler(adminGetOrdersController))

/**
 * Description: Admin - Update order status
 * Path: /orders/:id/status
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' }
 */
adminRouter.put(
  '/orders/:id/status',
  accessTokenValidator,
  requireAdmin,
  updateOrderStatusValidator,
  wrapRequestHandler(adminUpdateOrderStatusController)
)

/**
 * Description: Admin - List customers
 * Path: /customers
 * Method: GET
 * Query: { page?, limit?, keyword?, status?, sort_by?, order? }
 */
adminRouter.get('/customers', accessTokenValidator, requireAdmin, wrapRequestHandler(adminGetCustomersController))

/**
 * Description: Admin - Customer detail
 * Path: /customers/:id
 * Method: GET
 */
adminRouter.get(
  '/customers/:id',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(adminGetCustomerDetailController)
)

/**
 * Description: Admin - Update customer status (block/unlock)
 * Path: /customers/:id/status
 * Method: PUT
 */
adminRouter.put(
  '/customers/:id/status',
  accessTokenValidator,
  requireAdmin,
  updateCustomerStatusValidator,
  wrapRequestHandler(adminUpdateCustomerStatusController)
)

// Settings
adminRouter.get('/settings', accessTokenValidator, requireAdmin, wrapRequestHandler(adminGetSettingsController))
adminRouter.put(
  '/settings/general',
  accessTokenValidator,
  requireAdmin,
  updateSettingsGeneralValidator,
  wrapRequestHandler(adminUpdateSettingsGeneralController)
)
adminRouter.post(
  '/settings/logo',
  accessTokenValidator,
  requireAdmin,
  uploadLogo,
  wrapRequestHandler(adminUpdateSettingsLogoController)
)
adminRouter.put(
  '/settings/payment',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(adminUpdateSettingsPaymentController)
)
adminRouter.put(
  '/settings/shipping',
  accessTokenValidator,
  requireAdmin,
  wrapRequestHandler(adminUpdateSettingsShippingController)
)
