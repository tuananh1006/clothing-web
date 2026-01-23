import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import * as chatService from '@/services/chat.service'
import { getSocket, disconnectSocket } from '@/services/socket.service'
import { getToken } from '@/utils/storage'
import { formatTime } from '@/utils/formatters'
import Button from '@/components/common/Button'
import Spinner from '@/components/common/Spinner'
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react'
import type { Socket } from 'socket.io-client'

interface ChatBoxProps {
  onClose?: () => void
}

const ChatBox = ({ onClose }: ChatBoxProps) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<chatService.ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  // Initialize socket connection
  useEffect(() => {
    if (!user) return

    const token = getToken()
    if (!token) return

    const socketInstance = getSocket(token)
    setSocket(socketInstance)

    // Handler for new messages
    const handleNewMessage = (message: chatService.ChatMessage) => {
      setMessages((prev) => {
        // Avoid duplicates by _id
        if (prev.some((m) => m._id === message._id)) {
          return prev
        }
        // Replace temp message with real message if content matches
        const tempIndex = prev.findIndex(
          (m) => m._id?.startsWith('temp-') && m.message === message.message && m.sender_role === message.sender_role
        )
        if (tempIndex !== -1) {
          // Replace temp message with real message
          const newMessages = [...prev]
          newMessages[tempIndex] = message
          return newMessages
        }
        return [...prev, message]
      })
    }

    // Handler for errors
    const handleError = (error: { message: string }) => {
      console.error('Chat error:', error.message)
    }

    // Remove any existing listeners first to prevent duplicates
    socketInstance.off('chat:new_message', handleNewMessage)
    socketInstance.off('chat:error', handleError)

    // Register new listeners
    socketInstance.on('chat:new_message', handleNewMessage)
    socketInstance.on('chat:error', handleError)

    return () => {
      socketInstance.off('chat:new_message', handleNewMessage)
      socketInstance.off('chat:error', handleError)
    }
  }, [user])

  // Load messages when chat opens
  useEffect(() => {
    if (isOpen && user && socket) {
      loadMessages()
    }
  }, [isOpen, user, socket])

  const loadMessages = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // Chỉ lấy chat nếu đã có (đã gửi tin nhắn)
      const chat = await chatService.getOrCreateChat()
      if (chat) {
        // Load messages nếu đã có chat
        const msgs = await chatService.getMessages()
        setMessages(msgs)
      } else {
        // Chưa có chat, chưa có tin nhắn nào
        setMessages([])
      }
    } catch (error: any) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !user || !socket) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setSending(true)

    try {
      // Send via socket
      socket.emit('chat:send_message', { message: messageText })
      // Optimistically add message (will be confirmed by socket response)
      const tempMessage: chatService.ChatMessage = {
        _id: `temp-${Date.now()}`,
        sender_id: user._id || '',
        sender_role: 'customer',
        message: messageText,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, tempMessage])
    } catch (error: any) {
      console.error('Failed to send message:', error)
      setNewMessage(messageText) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true)
      setIsMinimized(false)
    } else {
      setIsMinimized(!isMinimized)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
    onClose?.()
  }

  if (!user) return null

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Mở chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-[#1a2c32] rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text-main dark:text-white">Chat với chúng tôi</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                <Minimize2 className="w-4 h-4 text-text-sub dark:text-gray-400" />
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4 text-text-sub dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="md" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-text-sub dark:text-gray-400">
                      Chào mừng bạn đến với hỗ trợ khách hàng!
                    </p>
                    <p className="text-sm text-text-sub dark:text-gray-500 mt-2">
                      Gửi tin nhắn để bắt đầu cuộc trò chuyện.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.sender_role === 'customer'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender_role === 'customer'
                              ? 'text-white/70'
                              : 'text-text-sub dark:text-gray-400'
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
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
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    aria-label="Gửi tin nhắn"
                  >
                    {sending ? (
                      <Spinner size="sm" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ChatBox

