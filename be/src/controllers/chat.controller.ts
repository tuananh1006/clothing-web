import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import chatServices from '~/services/chat.services'
import databaseServices from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'

// Customer: Lấy hoặc tạo chat
export const getOrCreateChatController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as any
    const result = await chatServices.getOrCreateChat(userId)
    
    // Nếu chưa có chat (chưa gửi tin nhắn nào), trả về null
    if (!result) {
      return res.status(HTTP_STATUS.OK).json({
        message: 'No chat found',
        data: null
      })
    }
    
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get chat success',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to get chat'
    })
  }
}

// Customer: Gửi tin nhắn
export const sendMessageController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as any
    const { message } = req.body

    if (!message || !message.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Message is required'
      })
    }

    const result = await chatServices.sendMessage(userId, message, 'customer')
    return res.status(HTTP_STATUS.OK).json({
      message: 'Send message success',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to send message'
    })
  }
}

// Customer: Lấy tin nhắn
export const getMessagesController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as any
    const messages = await chatServices.getChatMessages(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get messages success',
      data: messages
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to get messages'
    })
  }
}

// Admin: Lấy tất cả chats
export const getAllChatsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as string | undefined

    const result = await chatServices.getAllChats(page, limit, status)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all chats success',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to get chats'
    })
  }
}

// Admin: Lấy chi tiết chat
export const getChatDetailController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    const result = await chatServices.getChatDetail(chatId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get chat detail success',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: error.message || 'Chat not found'
    })
  }
}

// Admin: Gửi tin nhắn
export const adminSendMessageController = async (req: Request, res: Response) => {
  try {
    const { userId: adminId } = req.decoded_authorization as any
    const { chat_id, message } = req.body

    if (!chat_id || !message || !message.trim()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID and message are required'
      })
    }

    // Lấy chat để lấy user_id
    const chat = await chatServices.getChatDetail(chat_id)
    const result = await chatServices.sendMessage(chat.user_id, message, 'admin', adminId)
    
    return res.status(HTTP_STATUS.OK).json({
      message: 'Send message success',
      data: result
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to send message'
    })
  }
}

// Customer: Đóng chat
export const closeChatController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as any
    await chatServices.closeChatByUserId(userId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Close chat success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to close chat'
    })
  }
}

// Customer: Đánh dấu đã đọc
export const markAsReadController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.decoded_authorization as any
    const { message_ids } = req.body
    await chatServices.markAsRead(userId, message_ids)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Mark as read success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to mark as read'
    })
  }
}

// Admin: Đánh dấu đã đọc
export const adminMarkAsReadController = async (req: Request, res: Response) => {
  try {
    const { userId: adminId } = req.decoded_authorization as any
    const { chat_id } = req.body
    await chatServices.markAsReadByAdmin(chat_id, adminId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Mark as read success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to mark as read'
    })
  }
}

// Admin: Đánh dấu chưa xem
export const adminMarkAsUnviewedController = async (req: Request, res: Response) => {
  try {
    const { chat_id } = req.body
    
    if (!chat_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID is required'
      })
    }

    await chatServices.markAsUnviewed(chat_id)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Mark as unviewed success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to mark as unviewed'
    })
  }
}

// Admin: Xóa tin nhắn
export const deleteMessageController = async (req: Request, res: Response) => {
  try {
    const { userId: adminId } = req.decoded_authorization as any
    const { chat_id, message_id } = req.body
    
    if (!chat_id || !message_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID and Message ID are required'
      })
    }

    await chatServices.deleteMessage(chat_id, message_id, adminId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete message success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to delete message'
    })
  }
}

// Admin: Khôi phục tin nhắn
export const restoreMessageController = async (req: Request, res: Response) => {
  try {
    const { chat_id, message_id } = req.body
    
    if (!chat_id || !message_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID and Message ID are required'
      })
    }

    await chatServices.restoreMessage(chat_id, message_id)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Restore message success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to restore message'
    })
  }
}

// Admin: Đóng chat (chuyển vào thùng rác)
export const adminCloseChatController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    
    if (!chatId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID is required'
      })
    }

    await chatServices.closeChat(chatId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Close chat success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to close chat'
    })
  }
}

// Admin: Khôi phục chat từ thùng rác
export const adminRestoreChatController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    
    if (!chatId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID is required'
      })
    }

    await chatServices.restoreChat(chatId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Restore chat success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to restore chat'
    })
  }
}

// Admin: Xóa vĩnh viễn chat
export const adminPermanentlyDeleteChatController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    
    if (!chatId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Chat ID is required'
      })
    }

    await chatServices.permanentlyDeleteChat(chatId)
    return res.status(HTTP_STATUS.OK).json({
      message: 'Permanently delete chat success'
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to permanently delete chat'
    })
  }
}

// Admin: Lấy tin nhắn đã xóa (thùng rác)
export const getDeletedMessagesController = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params
    
    // Lấy tất cả tin nhắn bao gồm cả đã xóa
    const chat = await databaseServices.chats.findOne({ _id: new ObjectId(chatId) })
    if (!chat) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Chat not found'
      })
    }
    
    const deletedMessages = (chat.messages || []).filter((msg: any) => msg.deleted)
    
    return res.status(HTTP_STATUS.OK).json({
      message: 'Get deleted messages success',
      data: deletedMessages.map((msg: any) => ({
        _id: msg._id?.toString(),
        sender_id: msg.sender_id?.toString(),
        sender_role: msg.sender_role,
        message: msg.message,
        created_at: msg.created_at,
        deleted_at: msg.deleted_at,
        deleted_by: msg.deleted_by?.toString()
      }))
    })
  } catch (error: any) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Failed to get deleted messages'
    })
  }
}

