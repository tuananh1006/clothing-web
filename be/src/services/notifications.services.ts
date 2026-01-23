import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Notification, { NotificationTypeEnum } from '~/models/schemas/Notification.schema'
import { getIOInstance } from '~/socket/socket.server'

/**
 * Tạo notification mới
 */
export const createNotification = async (notificationData: {
  user_id: string
  type: NotificationTypeEnum
  title: string
  message: string
  data?: {
    order_id?: string
    order_code?: string
    coupon_id?: string
    coupon_code?: string
    [key: string]: any
  }
}) => {
  const notification = new Notification({
    user_id: new ObjectId(notificationData.user_id),
    type: notificationData.type,
    title: notificationData.title,
    message: notificationData.message,
    data: notificationData.data || {},
    read: false,
    created_at: new Date(),
    updated_at: new Date()
  })

  const result = await databaseServices.notifications.insertOne(notification)
  const insertedNotification = await databaseServices.notifications.findOne({ _id: result.insertedId })

  // Emit notification qua Socket.io real-time
  try {
    const io = getIOInstance()
    if (io && insertedNotification) {
      // Convert ObjectId to string for JSON serialization
      const notificationToEmit = {
        ...insertedNotification,
        _id: insertedNotification._id?.toString(),
        user_id: insertedNotification.user_id?.toString(),
        created_at: insertedNotification.created_at?.toISOString(),
        updated_at: insertedNotification.updated_at?.toISOString(),
        read_at: insertedNotification.read_at?.toISOString()
      }
      io.to(`user:${notificationData.user_id}`).emit('notification:new', notificationToEmit)
      console.log(`Emitted notification to user:${notificationData.user_id}`, notificationToEmit)
    } else {
      console.warn('Socket.io instance not available or notification not found')
    }
  } catch (error) {
    console.error('Error emitting notification via socket:', error)
    // Không throw error để không ảnh hưởng đến việc tạo notification
  }

  return insertedNotification
}

/**
 * Tạo notification cho nhiều users (broadcast)
 */
export const createNotificationsForUsers = async (
  user_ids: string[],
  notificationData: {
    type: NotificationTypeEnum
    title: string
    message: string
    data?: {
      order_id?: string
      order_code?: string
      coupon_id?: string
      coupon_code?: string
      [key: string]: any
    }
  }
) => {
  const notifications = user_ids.map((user_id) => ({
    user_id: new ObjectId(user_id),
    type: notificationData.type,
    title: notificationData.title,
    message: notificationData.message,
    data: notificationData.data || {},
    read: false,
    created_at: new Date(),
    updated_at: new Date()
  }))

  if (notifications.length > 0) {
    await databaseServices.notifications.insertMany(notifications)

    // Emit notifications qua Socket.io real-time cho từng user
    try {
      const io = getIOInstance()
      if (io) {
        notifications.forEach((notification) => {
          io.to(`user:${notification.user_id.toString()}`).emit('notification:new', notification)
        })
      }
    } catch (error) {
      console.error('Error emitting notifications via socket:', error)
      // Không throw error để không ảnh hưởng đến việc tạo notifications
    }
  }

  return notifications
}

/**
 * Tạo notification cho tất cả users (broadcast to all)
 */
export const createNotificationForAllUsers = async (notificationData: {
  type: NotificationTypeEnum
  title: string
  message: string
  data?: {
    order_id?: string
    order_code?: string
    coupon_id?: string
    coupon_code?: string
    [key: string]: any
  }
}) => {
  // Lấy tất cả user IDs (chỉ customer, không phải admin)
  const users = await databaseServices.users.find({ role: 'Customer' }).toArray()
  const user_ids = users.map((user) => user._id?.toString()).filter((id): id is string => Boolean(id))

  return createNotificationsForUsers(user_ids, notificationData)
}

/**
 * Lấy notifications của user
 */
export const getUserNotifications = async (
  user_id: string,
  options: {
    page?: number
    limit?: number
    read?: boolean
  } = {}
) => {
  const { page = 1, limit = 20, read } = options
  const skip = (page - 1) * limit

  const filter: any = {
    user_id: new ObjectId(user_id)
  }

  if (read !== undefined) {
    filter.read = read
  }

  const [notifications, total] = await Promise.all([
    databaseServices.notifications
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    databaseServices.notifications.countDocuments(filter)
  ])

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      total_page: Math.ceil(total / limit)
    }
  }
}

/**
 * Đếm số notifications chưa đọc
 */
export const getUnreadCount = async (user_id: string) => {
  const count = await databaseServices.notifications.countDocuments({
    user_id: new ObjectId(user_id),
    read: false
  })
  return count
}

/**
 * Đánh dấu notification là đã đọc
 */
export const markAsRead = async (notification_id: string, user_id: string) => {
  const result = await databaseServices.notifications.updateOne(
    {
      _id: new ObjectId(notification_id),
      user_id: new ObjectId(user_id)
    },
    {
      $set: {
        read: true,
        read_at: new Date(),
        updated_at: new Date()
      }
    }
  )
  return result
}

/**
 * Đánh dấu tất cả notifications là đã đọc
 */
export const markAllAsRead = async (user_id: string) => {
  const result = await databaseServices.notifications.updateMany(
    {
      user_id: new ObjectId(user_id),
      read: false
    },
    {
      $set: {
        read: true,
        read_at: new Date(),
        updated_at: new Date()
      }
    }
  )
  return result
}

/**
 * Xóa notification
 */
export const deleteNotification = async (notification_id: string, user_id: string) => {
  const result = await databaseServices.notifications.deleteOne({
    _id: new ObjectId(notification_id),
    user_id: new ObjectId(user_id)
  })
  return result
}

