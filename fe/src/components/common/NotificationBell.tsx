import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, type Notification } from '@/services/notifications.service'
import { getSocket } from '@/services/socket.service'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ROUTES } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'

const NotificationBell = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Load notifications and unread count
  const loadNotifications = async () => {
    if (!isAuthenticated) return

    try {
      setIsLoading(true)
      const [notificationsData, count] = await Promise.all([
        getNotifications({ page: 1, limit: 10 }),
        getUnreadCount()
      ])
      setNotifications(notificationsData.notifications)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load on mount and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [isAuthenticated])

  // Reload notifications when dropdown opens (in case socket missed it)
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadNotifications()
    }
  }, [isOpen, isAuthenticated])

  // Socket.io: Listen for new notifications
  useEffect(() => {
    if (!isAuthenticated) return

    const socket = getSocket()
    if (!socket) {
      console.warn('Socket not available for notifications')
      return
    }

    const handleNewNotification = (notification: Notification) => {
      console.log('Received new notification via socket:', notification)
      setNotifications((prev) => {
        // Check if notification already exists to avoid duplicates
        const exists = prev.some((n) => n._id === notification._id)
        if (exists) return prev
        return [notification, ...prev]
      })
      setUnreadCount((prev) => prev + 1)
    }

    socket.on('notification:new', handleNewNotification)
    console.log('Listening for notification:new events')

    return () => {
      socket.off('notification:new', handleNewNotification)
    }
  }, [isAuthenticated])

  // Reload notifications when dropdown opens (in case socket missed it)
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadNotifications()
    }
  }, [isOpen, isAuthenticated])

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Handle delete notification
  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      const notification = notifications.find((n) => n._id === notificationId)
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id)
    }

    // Navigate based on notification type
    if (
      (notification.type === 'order_status_update' ||
        notification.type === 'order_placed' ||
        notification.type === 'order_cancelled') &&
      notification.data?.order_id
    ) {
      navigate(`${ROUTES.ORDERS}/${notification.data.order_id}`)
    } else if (notification.type === 'new_coupon') {
      navigate(ROUTES.CHECKOUT)
    } else if (notification.type === 'review_rejected' && notification.data?.product_id) {
      navigate(`${ROUTES.PRODUCTS}/${notification.data.product_id}`)
    }

    setIsOpen(false)
  }

  // Get notification icon
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_status_update':
      case 'order_shipped':
      case 'order_delivered':
      case 'order_cancelled':
        return 'local_shipping'
      case 'new_coupon':
        return 'local_offer'
      default:
        return 'notifications'
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-lg size-10 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-main dark:text-gray-200 transition-colors"
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-text-main dark:text-white">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-2xl text-primary">
                  progress_activity
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-text-sub dark:text-gray-400">
                Không có thông báo nào
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <span
                          className={`material-symbols-outlined text-2xl ${
                            !notification.read ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? 'text-text-main dark:text-white'
                                  : 'text-text-sub dark:text-gray-400'
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-text-sub dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-sub dark:text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: vi
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1" />
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notification._id)
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete notification"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell

