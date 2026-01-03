import { Request, Response } from 'express'
import ordersServices from '~/services/orders.services'

export const getOrdersController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { page, limit, keyword, status, start_date, end_date } = req.query

  const result = await ordersServices.getOrders(userId, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    keyword,
    status,
    start_date,
    end_date
  })

  return res.json({
    message: 'Get orders successfully',
    data: result
  })
}

export const getOrderController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { order_id } = req.params
  const order = await ordersServices.getOrderDetail(userId, order_id)

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  return res.json({
    message: 'Get order details successfully',
    data: order
  })
}

export const cancelOrderController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { order_id } = req.params

  try {
    const result = await ordersServices.cancelOrder(userId, order_id)

    return res.json({
      message: 'Cancel order successfully',
      data: result
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to cancel order'
    })
  }
}
