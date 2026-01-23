import { Router } from 'express'
import {
  getNotificationsController,
  getUnreadCountController,
  markAsReadController,
  markAllAsReadController,
  deleteNotificationController
} from '~/controllers/notifications.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const notificationsRouter = Router()

/**
 * Description: Get user notifications
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { page?, limit?, read? }
 */
notificationsRouter.get('/', accessTokenValidator, wrapRequestHandler(getNotificationsController))

/**
 * Description: Get unread count
 * Path: /unread-count
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
notificationsRouter.get('/unread-count', accessTokenValidator, wrapRequestHandler(getUnreadCountController))

/**
 * Description: Mark notification as read
 * Path: /:notification_id/read
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
notificationsRouter.post('/:notification_id/read', accessTokenValidator, wrapRequestHandler(markAsReadController))

/**
 * Description: Mark all notifications as read
 * Path: /mark-all-read
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
notificationsRouter.post('/mark-all-read', accessTokenValidator, wrapRequestHandler(markAllAsReadController))

/**
 * Description: Delete notification
 * Path: /:notification_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
notificationsRouter.delete('/:notification_id', accessTokenValidator, wrapRequestHandler(deleteNotificationController))

export default notificationsRouter

