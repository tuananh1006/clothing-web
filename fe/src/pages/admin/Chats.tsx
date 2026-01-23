import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Select from '@/components/common/Select'
import Pagination from '@/components/common/Pagination'
import Modal from '@/components/common/Modal'
import Spinner from '@/components/common/Spinner'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import * as adminService from '@/services/admin.service'
import { getSocket, disconnectSocket } from '@/services/socket.service'
import { getToken } from '@/utils/storage'
import { PAGINATION } from '@/utils/constants'
import { formatDateShort, formatTime } from '@/utils/formatters'
import { MessageCircle, Send, X, User, Trash2, RotateCcw, RefreshCw, Eye, EyeOff } from 'lucide-react'
import type { Socket } from 'socket.io-client'

const AdminChats = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showSuccess, showError } = useToast()
  const { user } = useAuth()

  const [chats, setChats] = useState<adminService.AdminChat[]>([])
  const [selectedChat, setSelectedChat] = useState<adminService.AdminChatDetail | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_LIMIT,
    total_page: 1,
    total: 0,
  })
  const [chatCounts, setChatCounts] = useState({
    all: 0,
    unreplied: 0,
    replied: 0,
    deleted: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [chatListFilter, setChatListFilter] = useState<'all' | 'unreplied' | 'replied' | 'deleted'>('all')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [showDeletedMessages, setShowDeletedMessages] = useState(false)
  const [messageFilter, setMessageFilter] = useState<'all' | 'replied' | 'unreplied' | 'deleted'>('all')
  const [deletedMessages, setDeletedMessages] = useState<Array<{
    _id: string
    sender_id: string
    sender_role: 'customer' | 'admin'
    message: string
    created_at: string
    deleted_at: string
    deleted_by: string
  }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)

  // Load chat counts for all tabs
  const loadChatCounts = async () => {
    try {
      const [allResult, unrepliedResult, repliedResult, deletedResult] = await Promise.all([
        adminService.getChats({ page: 1, limit: 1 }), // "Tất cả" - chỉ lấy open/pending
        adminService.getChats({ page: 1, limit: 1, status: 'unreplied' }), // Dùng 'unreplied' thay vì 'pending'
        adminService.getChats({ page: 1, limit: 1, status: 'replied' }), // Dùng 'replied' thay vì 'open'
        adminService.getChats({ page: 1, limit: 1, status: 'closed' }),
      ])
      
      setChatCounts({
        all: allResult.pagination.total,
        unreplied: unrepliedResult.pagination.total,
        replied: repliedResult.pagination.total,
        deleted: deletedResult.pagination.total,
      })
    } catch (error: any) {
      console.error('Failed to load chat counts:', error)
    }
  }

  // Load chats
  const loadChats = async () => {
    setIsLoading(true)
    try {
      const page = parseInt(searchParams.get('page') || '1')
      // Map chatListFilter to status for API
      let status: string | undefined
      if (chatListFilter === 'unreplied') {
        status = 'unreplied' // Dùng 'unreplied' để filter đúng (kiểm tra có tin nhắn admin không)
      } else if (chatListFilter === 'replied') {
        status = 'replied' // Dùng 'replied' để filter đúng (có tin nhắn admin)
      } else if (chatListFilter === 'deleted') {
        status = 'closed'
      }
      
      const result = await adminService.getChats({
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        status: status,
      })
      setChats(result.chats)
      setPagination(result.pagination)
      
      // Cập nhật count cho tab hiện tại
      setChatCounts((prev) => ({
        ...prev,
        [chatListFilter]: result.pagination.total,
      }))
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể tải danh sách chats')
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize socket connection
  useEffect(() => {
    if (!user) return

    const token = getToken()
    if (!token) return

    const socketInstance = getSocket(token)
    setSocket(socketInstance)

    // Listen for new customer messages
    socketInstance.on('chat:new_customer_message', (data: {
      chat_id: string
      user_id: string
      message: any
    }) => {
      // Update selected chat if it's the current one
      if (selectedChat && selectedChat._id === data.chat_id) {
        setSelectedChat((prev) => {
          if (!prev) return null
          // Kiểm tra duplicate message
          const messageExists = prev.messages.some((msg) => msg._id === data.message._id)
          if (messageExists) {
            return prev
          }
          return {
            ...prev,
            messages: [...prev.messages, data.message],
            unread_count: (prev.unread_count || 0) + 1, // Tăng unread_count
          }
        })
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        // Nếu đang xem chat này, tự động đánh dấu đã đọc sau 1 giây
        setTimeout(async () => {
          try {
            await adminService.adminMarkAsRead(data.chat_id)
            setSelectedChat((prev) => {
              if (!prev) return null
              return { ...prev, unread_count: 0, viewed: true }
            })
            // Cập nhật danh sách chats mà không reload
            setChats((prevChats) =>
              prevChats.map((chat) =>
                chat._id === data.chat_id
                  ? { ...chat, unread_count: 0, viewed: true, last_message: data.message }
                  : chat
              )
            )
          } catch (error) {
            console.error('Failed to mark as read:', error)
          }
        }, 1000)
      } else {
        // Cập nhật danh sách chats mà không reload toàn bộ
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === data.chat_id
              ? {
                  ...chat,
                  unread_count: (chat.unread_count || 0) + 1,
                  last_message: data.message,
                  viewed: false,
                }
              : chat
          )
        )
      }
    })

    // Listen for new admin messages
    socketInstance.on('chat:new_admin_message', (data: {
      chat_id: string
      message: any
    }) => {
      // Update selected chat if it's the current one
      if (selectedChat && selectedChat._id === data.chat_id) {
        setSelectedChat((prev) => {
          if (!prev) return null
          // Kiểm tra duplicate message
          const messageExists = prev.messages.some((msg) => msg._id === data.message._id)
          if (messageExists) {
            return prev
          }
          return {
            ...prev,
            messages: [...prev.messages, data.message],
          }
        })
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
      // Cập nhật danh sách chats mà không reload toàn bộ
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === data.chat_id
            ? { ...chat, last_message: data.message }
            : chat
        )
      )
    })

    // Listen for errors
    socketInstance.on('chat:error', (error: { message: string }) => {
      showError(error.message)
    })

    return () => {
      socketInstance.off('chat:new_customer_message')
      socketInstance.off('chat:new_admin_message')
      socketInstance.off('chat:error')
    }
  }, [user, selectedChat?._id])

  useEffect(() => {
    loadChatCounts()
  }, [])

  useEffect(() => {
    loadChats()
  }, [searchParams, chatListFilter])

  // Load chat detail
  const loadChatDetail = async (chatId: string) => {
    setIsLoadingDetail(true)
    
    // Optimistic update: Cập nhật UI ngay lập tức
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId
          ? { ...chat, unread_count: 0, viewed: true }
          : chat
      )
    )
    
    try {
      const detail = await adminService.getChatDetail(chatId)
      setSelectedChat({
        ...detail,
        unread_count: 0,
        viewed: true,
      })
      
      // Join chat room via socket
      if (socket) {
        socket.emit('join_chat', { chat_id: chatId })
      }
      
      // Đánh dấu đã đọc ở background (không chờ response)
      adminService.adminMarkAsRead(chatId).catch((error) => {
        console.error('Failed to mark as read:', error)
        // Rollback nếu có lỗi
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === chatId
              ? { ...chat, unread_count: chat.unread_count || 0, viewed: chat.viewed || false }
              : chat
          )
        )
      })
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể tải chi tiết chat')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !selectedChat || !socket) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      // Send via socket (socket response sẽ cập nhật message)
      socket.emit('chat:admin_send_message', {
        chat_id: selectedChat._id,
        message: messageText,
      })
      
      // Scroll to bottom sau khi nhận socket response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể gửi tin nhắn')
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  // Load deleted messages
  const loadDeletedMessages = async (chatId: string) => {
    try {
      const deleted = await adminService.getDeletedMessages(chatId)
      setDeletedMessages(deleted)
    } catch (error: any) {
      console.error('Failed to load deleted messages:', error)
    }
  }

  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedChat) return
    
    try {
      await adminService.deleteMessage(selectedChat._id, messageId)
      // Cập nhật selectedChat - ẩn tin nhắn đã xóa
      setSelectedChat((prev) => {
        if (!prev) return null
        return {
          ...prev,
          messages: prev.messages.filter((msg) => msg._id !== messageId),
        }
      })
      showSuccess('Đã xóa tin nhắn')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa tin nhắn')
    }
  }

  // Handle restore message
  const handleRestoreMessage = async (messageId: string) => {
    if (!selectedChat) return
    
    try {
      await adminService.restoreMessage(selectedChat._id, messageId)
      // Reload chat detail để lấy lại tin nhắn đã khôi phục
      await loadChatDetail(selectedChat._id)
      // Reload deleted messages
      await loadDeletedMessages(selectedChat._id)
      showSuccess('Đã khôi phục tin nhắn')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể khôi phục tin nhắn')
    }
  }

  // Handle restore chat (khôi phục từ thùng rác)
  const handleRestoreChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      await adminService.adminRestoreChat(chatId)
      // Nếu đang xem chat này, đóng nó
      if (selectedChat?._id === chatId) {
        setSelectedChat(null)
      }
      // Cập nhật state trực tiếp - xóa chat khỏi danh sách
      const remainingChats = chats.filter((chat) => chat._id !== chatId)
      setChats(remainingChats)
      
      // Cập nhật pagination total
      const newTotal = pagination.total - 1
      const newTotalPage = Math.ceil(newTotal / PAGINATION.DEFAULT_LIMIT)
      
      // Nếu trang hiện tại trống và không phải trang 1, chuyển về trang 1
      if (remainingChats.length === 0 && pagination.page > 1) {
        setSearchParams((prev) => {
          prev.set('page', '1')
          return prev
        })
        setPagination((prev) => ({
          ...prev,
          page: 1,
          total: newTotal,
          total_page: newTotalPage,
        }))
      } else {
        setPagination((prev) => ({
          ...prev,
          total: newTotal,
          total_page: newTotalPage,
        }))
      }
      
      // Cập nhật chat counts - giảm "Thùng rác", tăng "Tất cả"
      setChatCounts((prev) => ({
        ...prev,
        deleted: Math.max(0, prev.deleted - 1),
        all: prev.all + 1,
      }))
      showSuccess('Đã khôi phục chat')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể khôi phục chat')
    }
  }

  // Handle permanently delete chat (xóa vĩnh viễn) - mở modal xác nhận
  const handlePermanentlyDeleteChatClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatToDelete(chatId)
    setShowDeleteConfirmModal(true)
  }

  // Xác nhận xóa vĩnh viễn
  const handleConfirmPermanentlyDelete = async () => {
    if (!chatToDelete) return
    
    try {
      await adminService.adminPermanentlyDeleteChat(chatToDelete)
      // Nếu đang xem chat này, đóng nó
      if (selectedChat?._id === chatToDelete) {
        setSelectedChat(null)
      }
      // Cập nhật state trực tiếp - xóa chat khỏi danh sách
      const remainingChats = chats.filter((chat) => chat._id !== chatToDelete)
      setChats(remainingChats)
      
      // Cập nhật pagination total
      const newTotal = pagination.total - 1
      const newTotalPage = Math.ceil(newTotal / PAGINATION.DEFAULT_LIMIT)
      
      // Nếu trang hiện tại trống và không phải trang 1, chuyển về trang 1
      if (remainingChats.length === 0 && pagination.page > 1) {
        setSearchParams((prev) => {
          prev.set('page', '1')
          return prev
        })
        setPagination((prev) => ({
          ...prev,
          page: 1,
          total: newTotal,
          total_page: newTotalPage,
        }))
      } else {
        setPagination((prev) => ({
          ...prev,
          total: newTotal,
          total_page: newTotalPage,
        }))
      }
      
      // Cập nhật chat counts - chỉ giảm "Thùng rác"
      setChatCounts((prev) => ({
        ...prev,
        deleted: Math.max(0, prev.deleted - 1),
      }))
      setShowDeleteConfirmModal(false)
      setChatToDelete(null)
      showSuccess('Đã xóa vĩnh viễn chat')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa vĩnh viễn chat')
      setShowDeleteConfirmModal(false)
      setChatToDelete(null)
    }
  }

  // Handle delete chat (đóng chat và chuyển vào thùng rác)
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Ngăn chặn click vào chat item
    
    try {
      await adminService.adminCloseChat(chatId)
      // Nếu đang xem chat này, đóng nó
      if (selectedChat?._id === chatId) {
        setSelectedChat(null)
      }
      // Cập nhật state trực tiếp - xóa chat khỏi danh sách
      const remainingChats = chats.filter((chat) => chat._id !== chatId)
      setChats(remainingChats)
      
      // Cập nhật pagination total
      const newTotal = pagination.total - 1
      const newTotalPage = Math.ceil(newTotal / PAGINATION.DEFAULT_LIMIT)
      
      // Nếu trang hiện tại trống và không phải trang 1, chuyển về trang 1
      if (remainingChats.length === 0 && pagination.page > 1) {
        setSearchParams((prev) => {
          prev.set('page', '1')
          return prev
        })
        setPagination((prev) => ({
          ...prev,
          page: 1,
          total: newTotal,
          total_page: newTotalPage,
        }))
      } else {
        setPagination((prev) => ({
          ...prev,
          total: newTotal,
          total_page: newTotalPage,
        }))
      }
      
      // Cập nhật chat counts - giảm tab hiện tại và "Tất cả", tăng "Thùng rác"
      setChatCounts((prev) => {
        const newCounts = { ...prev }
        // Giảm tab hiện tại
        if (chatListFilter !== 'all') {
          newCounts[chatListFilter as keyof typeof newCounts] = Math.max(0, (prev[chatListFilter as keyof typeof prev] as number) - 1)
        }
        // Giảm "Tất cả"
        newCounts.all = Math.max(0, prev.all - 1)
        // Tăng "Thùng rác"
        newCounts.deleted = prev.deleted + 1
        return newCounts
      })
      showSuccess('Đã xóa chat')
    } catch (error: any) {
      showError(error.response?.data?.message || 'Không thể xóa chat')
    }
  }

  // Load deleted messages when showing deleted messages or filter is deleted
  useEffect(() => {
    if ((showDeletedMessages || messageFilter === 'deleted') && selectedChat) {
      loadDeletedMessages(selectedChat._id)
    }
  }, [showDeletedMessages, messageFilter, selectedChat?._id])

  // Reset filter when chat changes
  useEffect(() => {
    setMessageFilter('all')
    setShowDeletedMessages(false)
  }, [selectedChat?._id])

  // Filter messages based on selection
  const getFilteredMessages = () => {
    if (!selectedChat) return []
    
    if (messageFilter === 'deleted') {
      return deletedMessages
    }
    
    if (messageFilter === 'all') {
      return selectedChat.messages
    }
    
    // For 'replied' and 'unreplied', filter based on whether admin has replied
    // 'replied': Chat has at least one message from admin (status = 'open')
    // 'unreplied': Chat has no messages from admin (status = 'pending')
    if (messageFilter === 'replied') {
      // Chỉ hiển thị tin nhắn từ chat đã có admin trả lời
      const hasAdminMessage = selectedChat.messages.some(msg => msg.sender_role === 'admin')
      if (hasAdminMessage) {
        return selectedChat.messages
      }
      return []
    }
    
    if (messageFilter === 'unreplied') {
      // Chỉ hiển thị tin nhắn từ chat chưa có admin trả lời
      const hasAdminMessage = selectedChat.messages.some(msg => msg.sender_role === 'admin')
      if (!hasAdminMessage) {
        return selectedChat.messages
      }
      return []
    }
    
    return selectedChat.messages
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString())
      return prev
    })
  }

  // Handle chat list filter change
  const handleChatListFilterChange = (filter: 'all' | 'unreplied' | 'replied' | 'deleted') => {
    setChatListFilter(filter)
    setSearchParams((prev) => {
      prev.set('page', '1')
      return prev
    })
  }

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        disconnectSocket()
      }
    }
  }, [socket])

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main dark:text-white mb-1">
            Quản lý Chat
          </h2>
          <p className="text-sm text-text-sub dark:text-gray-400">
            Xem và trả lời tin nhắn từ khách hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <div className="lg:col-span-1 bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleChatListFilterChange('all')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  chatListFilter === 'all'
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                Tất cả ({chatCounts.all})
              </button>
              <button
                onClick={() => handleChatListFilterChange('unreplied')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  chatListFilter === 'unreplied'
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                Chưa trả lời ({chatCounts.unreplied})
              </button>
              <button
                onClick={() => handleChatListFilterChange('replied')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  chatListFilter === 'replied'
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                Đã trả lời ({chatCounts.replied})
              </button>
              <button
                onClick={() => handleChatListFilterChange('deleted')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  chatListFilter === 'deleted'
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                Thùng rác ({chatCounts.deleted})
              </button>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Spinner size="md" />
                </div>
              ) : chats.length === 0 ? (
                <div className="p-8 text-center text-text-sub dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có chat nào</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`group relative w-full border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedChat?._id === chat._id
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : ''
                    }`}
                  >
                    <button
                      onClick={() => loadChatDetail(chat._id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {chat.user?.avatar ? (
                            <img
                              src={chat.user.avatar}
                              alt={chat.user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <p className={`font-medium truncate ${
                                chat.viewed === false || (chat.unread_count && chat.unread_count > 0)
                                  ? 'font-bold text-text-main dark:text-white'
                                  : 'text-text-main dark:text-white'
                              }`}>
                                {chat.user?.name || (chat.user?._id ? `#${chat.user._id.slice(-6).toUpperCase()}` : 'Khách hàng')}
                              </p>
                              {chat.user?._id && chat.user?.name && (
                                <span className="text-xs text-text-sub dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded font-mono flex-shrink-0">
                                  #{chat.user._id.slice(-6).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          {chat.last_message && (
                            <p className={`text-sm truncate mb-1 ${
                              chat.viewed === false || (chat.unread_count && chat.unread_count > 0)
                                ? 'font-semibold text-text-main dark:text-white'
                                : 'text-text-sub dark:text-gray-400'
                            }`}>
                              {chat.last_message.message}
                            </p>
                          )}
                          <p className="text-xs text-text-sub dark:text-gray-500">
                            {formatDateShort(chat.updated_at)}
                          </p>
                        </div>
                      </div>
                    </button>
                    {/* Nút xóa/khôi phục/xóa vĩnh viễn */}
                    {chatListFilter === 'deleted' ? (
                      // Ở thùng rác: hiển thị 2 nút (khôi phục và xóa vĩnh viễn)
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleRestoreChat(chat._id, e)}
                          className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                          title="Khôi phục"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handlePermanentlyDeleteChatClick(chat._id, e)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // Ở các tab khác: hiển thị nút toggle đánh dấu đã xem/chưa xem và nút xóa
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {chat.viewed ? (
                          // Nếu đã xem → hiển thị nút đánh dấu chưa xem
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              try {
                                await adminService.adminMarkAsUnviewed(chat._id)
                                // Cập nhật state trực tiếp
                                setChats((prevChats) =>
                                  prevChats.map((c) =>
                                    c._id === chat._id
                                      ? { ...c, viewed: false, unread_count: (c.unread_count || 0) + 1 }
                                      : c
                                  )
                                )
                                // Cập nhật selectedChat nếu đang xem chat này
                                if (selectedChat?._id === chat._id) {
                                  setSelectedChat((prev) => {
                                    if (!prev) return null
                                    return { ...prev, viewed: false, unread_count: (prev.unread_count || 0) + 1 }
                                  })
                                }
                                showSuccess('Đã đánh dấu chưa xem')
                              } catch (error: any) {
                                showError(error.response?.data?.message || 'Không thể đánh dấu chưa xem')
                              }
                            }}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            title="Đánh dấu chưa xem"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          // Nếu chưa xem → hiển thị nút đánh dấu đã xem
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              try {
                                await adminService.adminMarkAsRead(chat._id)
                                // Cập nhật state trực tiếp
                                setChats((prevChats) =>
                                  prevChats.map((c) =>
                                    c._id === chat._id
                                      ? { ...c, viewed: true, unread_count: 0 }
                                      : c
                                  )
                                )
                                // Cập nhật selectedChat nếu đang xem chat này
                                if (selectedChat?._id === chat._id) {
                                  setSelectedChat((prev) => {
                                    if (!prev) return null
                                    return { ...prev, viewed: true, unread_count: 0 }
                                  })
                                }
                                showSuccess('Đã đánh dấu đã xem')
                              } catch (error: any) {
                                showError(error.response?.data?.message || 'Không thể đánh dấu đã xem')
                              }
                            }}
                            className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                            title="Đánh dấu đã xem"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteChat(chat._id, e)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Xóa chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            {!isLoading && chats.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.total_page}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Chat Detail */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1a2c32] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {selectedChat.user?.avatar ? (
                          <img
                            src={selectedChat.user.avatar}
                            alt={selectedChat.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-text-main dark:text-white">
                                {selectedChat.user?.name || (selectedChat.user?._id ? `#${selectedChat.user._id.slice(-6).toUpperCase()}` : 'Khách hàng')}
                              </p>
                              {selectedChat.user?._id && selectedChat.user?.name && (
                                <span className="text-xs text-text-sub dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded font-mono">
                                  #{selectedChat.user._id.slice(-6).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-text-sub dark:text-gray-400">
                              {selectedChat.user?.email}
                            </p>
                          </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChat(null)
                        setShowDeletedMessages(false)
                        setMessageFilter('all')
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-text-sub dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                  {messageFilter === 'deleted' ? (
                    // Thùng rác - hiển thị tin nhắn đã xóa
                    deletedMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Trash2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-text-sub dark:text-gray-400">
                          Thùng rác trống
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-text-sub dark:text-gray-400">
                            Tin nhắn đã xóa ({deletedMessages.length})
                          </p>
                        </div>
                        {deletedMessages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`flex ${
                              msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 relative group ${
                                msg.sender_role === 'admin'
                                  ? 'bg-primary/50 text-white'
                                  : 'bg-gray-100/50 dark:bg-gray-700/50 text-text-main dark:text-white'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words line-through opacity-70">
                                {msg.message}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender_role === 'admin'
                                    ? 'text-white/70'
                                    : 'text-text-sub dark:text-gray-400'
                                }`}
                              >
                                {formatTime(msg.created_at)} • Đã xóa {formatTime(msg.deleted_at)}
                              </p>
                              <button
                                onClick={() => handleRestoreMessage(msg._id)}
                                className="absolute -top-2 -right-2 p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Khôi phục"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )
                  ) : isLoadingDetail ? (
                    <div className="flex justify-center items-center h-full">
                      <Spinner size="md" />
                    </div>
                  ) : (() => {
                    const filteredMessages = getFilteredMessages()
                    return filteredMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-text-sub dark:text-gray-400">
                          {messageFilter === 'replied' 
                            ? 'Không có tin nhắn đã trả lời'
                            : messageFilter === 'unreplied'
                            ? 'Không có tin nhắn chưa trả lời'
                            : 'Chưa có tin nhắn nào'}
                        </p>
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${
                            msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'
                          } group`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 relative ${
                              msg.sender_role === 'admin'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p
                                className={`text-xs ${
                                  msg.sender_role === 'admin'
                                    ? 'text-white/70'
                                    : 'text-text-sub dark:text-gray-400'
                                }`}
                              >
                                {formatTime(msg.created_at)}
                              </p>
                              {/* Nút xóa hiển thị cho cả tin nhắn của admin và customer */}
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className={`ml-2 p-1 rounded hover:bg-opacity-80 transition-opacity ${
                                  msg.sender_role === 'admin'
                                    ? 'text-white/70 hover:text-white hover:bg-white/20'
                                    : 'text-text-sub dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                                }`}
                                title="Xóa tin nhắn"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )
                  })()}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex gap-2 items-end">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        // Auto resize
                        if (textareaRef.current) {
                          textareaRef.current.style.height = 'auto'
                          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-main dark:text-white placeholder:text-text-sub dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[48px] max-h-[120px] overflow-y-auto"
                      disabled={sending}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                          // Reset height after send
                          if (textareaRef.current) {
                            textareaRef.current.style.height = '48px'
                          }
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6"
                    >
                      {sending ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Gửi
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-text-sub dark:text-gray-400">
                  Chọn một chat để xem chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Modal xác nhận xóa vĩnh viễn */}
        <Modal
          isOpen={showDeleteConfirmModal}
          onClose={() => {
            setShowDeleteConfirmModal(false)
            setChatToDelete(null)
          }}
          title="Xác nhận xóa vĩnh viễn"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-text-main dark:text-white font-medium mb-2">
                  Bạn có chắc muốn xóa vĩnh viễn chat này?
                </p>
                <p className="text-sm text-text-sub dark:text-gray-400">
                  Hành động này không thể hoàn tác. Chat và tất cả tin nhắn sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirmModal(false)
                  setChatToDelete(null)
                }}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmPermanentlyDelete}
              >
                Xóa vĩnh viễn
              </Button>
            </div>
          </div>
        </Modal>
      </AdminLayout>
    )
  }

  export default AdminChats

