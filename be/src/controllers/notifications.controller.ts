import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '~/services/notifications.services'

/**
 * Controller: Lấy notifications của user
 */
export const getNotificationsController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { page, limit, read } = req.query

  try {
    const result = await getUserNotifications(userId, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      read: read !== undefined ? read === 'true' : undefined
    })

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get notifications success',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

/**
 * Controller: Lấy số notifications chưa đọc
 */
export const getUnreadCountController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any

  try {
    const count = await getUnreadCount(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get unread count success',
      data: { count }
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

/**
 * Controller: Đánh dấu notification là đã đọc
 */
export const markAsReadController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { notification_id } = req.params

  try {
    await markAsRead(notification_id, userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Mark as read success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

/**
 * Controller: Đánh dấu tất cả notifications là đã đọc
 */
export const markAllAsReadController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any

  try {
    await markAllAsRead(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Mark all as read success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

/**
 * Controller: Xóa notification
 */
export const deleteNotificationController = async (req: Request, res: Response) => {
  const { userId } = req.decoded_authorization as any
  const { notification_id } = req.params

  try {
    await deleteNotification(notification_id, userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete notification success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Internal server error'
    })
  }
}

