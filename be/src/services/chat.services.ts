import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Chat, { ChatMessage } from '~/models/schemas/Chat.schema'

class ChatService {
  // Lấy chat của user (chỉ lấy chat đã có tin nhắn, không tạo mới)
  async getOrCreateChat(user_id: string) {
    const userId = new ObjectId(user_id)
    
    // Tìm chat đang mở của user (chỉ lấy chat đã có tin nhắn)
    const chat = await databaseServices.chats.findOne({
      user_id: userId,
      status: { $in: ['open', 'pending'] },
      $expr: { $gt: [{ $size: '$messages' }, 0] } // Chỉ lấy chat có ít nhất 1 tin nhắn
    })

    // Không tạo chat mới ở đây - chỉ tạo khi gửi tin nhắn đầu tiên
    if (!chat) {
      return null // Trả về null nếu chưa có chat
    }

    // Populate user info
    const user = await databaseServices.users.findOne({ _id: userId })
    
    return {
      _id: chat._id?.toString(),
      user_id: chat.user_id?.toString(),
      admin_id: chat.admin_id?.toString(),
      status: chat.status,
      messages: chat.messages || [],
      user: user ? {
        _id: user._id?.toString(),
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar: user.avatar
      } : null,
      created_at: chat.created_at,
      updated_at: chat.updated_at
    }
  }

  // Gửi tin nhắn
  async sendMessage(user_id: string, message: string, sender_role: 'customer' | 'admin' = 'customer', admin_id?: string) {
    const userId = new ObjectId(user_id)
    
    // Lấy hoặc tạo chat (chỉ tạo khi gửi tin nhắn đầu tiên)
    let chat = await databaseServices.chats.findOne({
      user_id: userId,
      status: { $in: ['open', 'pending'] }
    })

    // Nếu chưa có chat, tạo mới khi gửi tin nhắn đầu tiên
    if (!chat) {
      const newChat = new Chat({
        user_id: userId,
        messages: [],
        status: 'pending',
        viewed: false,
        last_customer_message_at: new Date()
      })
      const result = await databaseServices.chats.insertOne(newChat)
      chat = await databaseServices.chats.findOne({ _id: result.insertedId })
    }

    if (!chat) {
      throw new Error('Failed to create chat')
    }

    // Tạo message mới
    const newMessage: ChatMessage = {
      _id: new ObjectId(),
      sender_id: sender_role === 'admin' && admin_id ? new ObjectId(admin_id) : userId,
      sender_role,
      message: message.trim(),
      created_at: new Date(),
      read: false
    }

    // Cập nhật chat với message mới
    const updatedMessages = [...(chat.messages || []), newMessage]
    
    // Logic status đơn giản:
    // - pending: Customer đã gửi tin nhắn, chưa có admin trả lời
    // - open: Đã có admin trả lời, đang trong cuộc trò chuyện
    let newStatus = chat.status
    let updateData: any = {
      messages: updatedMessages,
      updated_at: new Date(),
    }

    if (sender_role === 'admin') {
      // Admin trả lời -> chuyển sang "open" và đánh dấu đã xem
      newStatus = 'open'
      updateData.status = newStatus
      updateData.viewed = true
      updateData.viewed_at = new Date()
      updateData.admin_id = new ObjectId(admin_id)
    } else if (sender_role === 'customer') {
      // Customer gửi tin nhắn -> đánh dấu chưa xem và cập nhật thời gian
      updateData.viewed = false
      updateData.last_customer_message_at = new Date()
      
      if (chat.status === 'pending') {
        // Giữ "pending" nếu chưa có admin trả lời
        updateData.status = 'pending'
      } else {
        // Giữ "open" nếu đã có admin trả lời trước đó
        updateData.status = 'open'
      }
    }
    
    await databaseServices.chats.updateOne(
      { _id: chat._id },
      { $set: updateData }
    )

    return {
      _id: newMessage._id?.toString(),
      sender_id: newMessage.sender_id?.toString(),
      sender_role: newMessage.sender_role,
      message: newMessage.message,
      created_at: newMessage.created_at
    }
  }

  // Lấy danh sách tin nhắn của chat
  async getChatMessages(user_id: string) {
    const userId = new ObjectId(user_id)
    
    const chat = await databaseServices.chats.findOne({
      user_id: userId,
      status: { $in: ['open', 'pending', 'closed'] }
    })

    if (!chat) {
      return []
    }

    return (chat.messages || [])
      .filter((msg: any) => !msg.deleted) // Chỉ lấy tin nhắn chưa xóa
      .map(msg => ({
        _id: msg._id?.toString(),
        sender_id: msg.sender_id?.toString(),
        sender_role: msg.sender_role,
        message: msg.message,
        created_at: msg.created_at,
        read: msg.read,
        deleted: msg.deleted,
        deleted_at: msg.deleted_at,
        deleted_by: msg.deleted_by?.toString()
      }))
  }

  // Đánh dấu đã đọc (cho customer - đánh dấu tin nhắn của admin)
  async markAsRead(user_id: string, message_ids?: string[]) {
    const userId = new ObjectId(user_id)
    
    if (message_ids && message_ids.length > 0) {
      // Đánh dấu các tin nhắn cụ thể
      const messageObjectIds = message_ids.map(id => new ObjectId(id))
      await databaseServices.chats.updateOne(
        { user_id: userId },
        {
          $set: {
            'messages.$[elem].read': true,
            updated_at: new Date()
          }
        },
        {
          arrayFilters: [{ 'elem._id': { $in: messageObjectIds } }]
        }
      )
    } else {
      // Đánh dấu tất cả tin nhắn của admin là đã đọc
      const chat = await databaseServices.chats.findOne({ user_id: userId })
      if (chat && chat.messages) {
        const updatedMessages = chat.messages.map(msg => {
          if (msg.sender_role === 'admin' && !msg.read) {
            return { ...msg, read: true }
          }
          return msg
        })
        await databaseServices.chats.updateOne(
          { user_id: userId },
          {
            $set: {
              messages: updatedMessages,
              updated_at: new Date()
            }
          }
        )
      }
    }
  }

  // Đánh dấu đã đọc cho admin (đánh dấu tin nhắn của customer)
  async markAsReadByAdmin(chat_id: string, admin_id: string) {
    const chatId = new ObjectId(chat_id)
    const adminId = new ObjectId(admin_id)
    
    const chat = await databaseServices.chats.findOne({ _id: chatId })
    if (chat && chat.messages) {
      const updatedMessages = chat.messages.map(msg => {
        if (msg.sender_role === 'customer' && !msg.read) {
          return { ...msg, read: true }
        }
        return msg
      })
      await databaseServices.chats.updateOne(
        { _id: chatId },
        {
          $set: {
            messages: updatedMessages,
            viewed: true,
            viewed_at: new Date(),
            updated_at: new Date()
          }
        }
      )
    }
  }

  // Đánh dấu chưa xem cho admin (đánh dấu lại chat là chưa xem)
  async markAsUnviewed(chat_id: string) {
    const chatId = new ObjectId(chat_id)
    
    await databaseServices.chats.updateOne(
      { _id: chatId },
      {
        $set: {
          viewed: false,
          viewed_at: undefined,
          updated_at: new Date()
        }
      }
    )
  }

  // Đóng chat (dùng chat_id)
  async closeChat(chat_id: string) {
    const chatId = new ObjectId(chat_id)
    
    await databaseServices.chats.updateOne(
      { _id: chatId },
      {
        $set: {
          status: 'closed',
          updated_at: new Date()
        }
      }
    )
  }

  // Khôi phục chat (đổi status từ closed về open/pending)
  async restoreChat(chat_id: string) {
    const chatId = new ObjectId(chat_id)
    
    const chat = await databaseServices.chats.findOne({ _id: chatId })
    if (!chat) {
      throw new Error('Chat not found')
    }

    // Xác định status mới: nếu có admin trả lời thì 'open', không thì 'pending'
    const hasAdminMessage = (chat.messages || []).some((msg: any) => msg.sender_role === 'admin')
    const newStatus = hasAdminMessage ? 'open' : 'pending'
    
    await databaseServices.chats.updateOne(
      { _id: chatId },
      {
        $set: {
          status: newStatus,
          updated_at: new Date()
        }
      }
    )
  }

  // Xóa vĩnh viễn chat
  async permanentlyDeleteChat(chat_id: string) {
    const chatId = new ObjectId(chat_id)
    
    // Kiểm tra chat có tồn tại không
    const chat = await databaseServices.chats.findOne({ _id: chatId })
    if (!chat) {
      throw new Error('Chat not found')
    }
    
    // Xóa chat
    const result = await databaseServices.chats.deleteOne({ _id: chatId })
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete chat')
    }
    
    console.log(`Permanently deleted chat: ${chat_id}`)
    return result.deletedCount
  }

  // Đóng chat theo user_id (cho customer)
  async closeChatByUserId(user_id: string) {
    const userId = new ObjectId(user_id)
    
    await databaseServices.chats.updateOne(
      { user_id: userId },
      {
        $set: {
          status: 'closed',
          updated_at: new Date()
        }
      }
    )
  }

  // Lấy tất cả chats cho admin
  async getAllChats(page: number = 1, limit: number = 20, status?: string) {
    const baseFilter: any = {
      $expr: { $gt: [{ $size: '$messages' }, 0] } // Chỉ lấy chat có ít nhất 1 tin nhắn
    }
    
    // Xử lý filter theo trạng thái
    if (status === 'closed' || status === 'deleted') {
      baseFilter.status = 'closed'
    } else if (status === 'unviewed') {
      baseFilter.viewed = false
      baseFilter.status = { $ne: 'closed' }
    } else if (status === 'viewed') {
      baseFilter.viewed = true
      baseFilter.status = { $ne: 'closed' }
    } else {
      // Mặc định: "Tất cả" - chỉ lấy chat chưa đóng (open, pending)
      baseFilter.status = { $in: ['open', 'pending'] }
    }

    // Lấy tất cả chats (không phân trang để filter đúng)
    // Đối với "unreplied" và "replied", cần lấy tất cả chats (không filter status trước)
    let allChats
    if (status === 'unreplied' || status === 'replied' || status === 'pending' || status === 'open') {
      // Lấy tất cả chats có messages và chưa đóng để filter đúng
      allChats = await databaseServices.chats.find({
        $expr: { $gt: [{ $size: '$messages' }, 0] },
        status: { $ne: 'closed' }
      }).toArray()
    } else {
      allChats = await databaseServices.chats.find(baseFilter).toArray()
    }

    // Filter trong code cho "unreplied" và "replied"
    let filteredChats = allChats
    if (status === 'unreplied' || status === 'pending') {
      // Chưa trả lời: tin nhắn cuối cùng là từ customer (admin chưa trả lời tin nhắn mới nhất)
      filteredChats = allChats.filter((chat: any) => {
        const messages = (chat.messages || []).filter((msg: any) => !msg.deleted) // Bỏ qua tin nhắn đã xóa
        if (messages.length === 0) return false // Không có tin nhắn nào
        const lastMessage = messages[messages.length - 1] // Tin nhắn cuối cùng
        return lastMessage.sender_role === 'customer' && chat.status !== 'closed'
      })
    } else if (status === 'replied' || status === 'open') {
      // Đã trả lời: tin nhắn cuối cùng là từ admin (đã trả lời tin nhắn mới nhất)
      filteredChats = allChats.filter((chat: any) => {
        const messages = (chat.messages || []).filter((msg: any) => !msg.deleted) // Bỏ qua tin nhắn đã xóa
        if (messages.length === 0) return false // Không có tin nhắn nào
        const lastMessage = messages[messages.length - 1] // Tin nhắn cuối cùng
        return lastMessage.sender_role === 'admin' && chat.status !== 'closed'
      })
    }

    // Sắp xếp: ưu tiên tin nhắn mới nhất
    // Sử dụng last_customer_message_at nếu có, nếu không thì dùng updated_at
    filteredChats.sort((a: any, b: any) => {
      // Lấy thời gian tin nhắn cuối cùng (không bị xóa)
      const getLastMessageTime = (chat: any) => {
        const messages = (chat.messages || []).filter((msg: any) => !msg.deleted)
        if (messages.length === 0) return chat.updated_at || chat.created_at || new Date(0)
        const lastMessage = messages[messages.length - 1]
        return lastMessage.created_at || chat.updated_at || chat.created_at || new Date(0)
      }
      
      const timeA = getLastMessageTime(a)
      const timeB = getLastMessageTime(b)
      
      // Sắp xếp giảm dần (mới nhất lên đầu)
      return new Date(timeB).getTime() - new Date(timeA).getTime()
    })

    // Tính total và pagination
    const total = filteredChats.length
    const skip = (page - 1) * limit
    const chats = filteredChats.slice(skip, skip + limit)

    // Populate user info
    const userIds = chats.map(chat => chat.user_id).filter(Boolean)
    const users = await databaseServices.users.find({ _id: { $in: userIds } }).toArray()
    const userMap = new Map(users.map(u => [u._id?.toString(), u]))

    // Cleanup inactive chats trước khi lấy danh sách (chỉ chạy mỗi 1 phút, không chạy mỗi lần load)
    // Cleanup được chạy bởi cron job trong index.ts

    const chatsWithUsers = chats.map(chat => {
      const user = userMap.get(chat.user_id?.toString())
      // Đếm số tin nhắn chưa đọc (của customer, chưa được admin đọc)
      const unreadCount = (chat.messages || []).filter(
        (msg: any) => msg.sender_role === 'customer' && !msg.read
      ).length
      
      // Xác định trạng thái: đã xem hoặc chưa xem
      const isViewed = chat.viewed || false
      
      return {
        _id: chat._id?.toString(),
        user_id: chat.user_id?.toString(),
        admin_id: chat.admin_id?.toString(),
        status: chat.status,
        viewed: isViewed, // Trạng thái đã xem/chưa xem
        viewed_at: chat.viewed_at,
        message_count: (chat.messages || []).length,
        unread_count: unreadCount,
        last_message: (() => {
          const messages = (chat.messages || []).filter((msg: any) => !msg.deleted)
          return messages.length > 0 ? messages[messages.length - 1] : null
        })(),
        user: user ? {
          _id: user._id?.toString(),
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          email: user.email,
          avatar: user.avatar
        } : null,
        created_at: chat.created_at,
        updated_at: chat.updated_at
      }
    })

    return {
      chats: chatsWithUsers,
      pagination: {
        page,
        limit,
        total,
        total_page: Math.ceil(total / limit)
      }
    }
  }

  // Lấy chi tiết chat cho admin
  async getChatDetail(chat_id: string) {
    const chatId = new ObjectId(chat_id)
    
    const chat = await databaseServices.chats.findOne({ _id: chatId })
    
    if (!chat) {
      throw new Error('Chat not found')
    }

    const user = await databaseServices.users.findOne({ _id: chat.user_id })
    const admin = chat.admin_id ? await databaseServices.users.findOne({ _id: chat.admin_id }) : null

    return {
      _id: chat._id?.toString(),
      user_id: chat.user_id?.toString(),
      admin_id: chat.admin_id?.toString(),
      status: chat.status,
      messages: (chat.messages || [])
        .filter((msg: any) => !msg.deleted) // Chỉ lấy tin nhắn chưa xóa
        .map(msg => ({
          _id: msg._id?.toString(),
          sender_id: msg.sender_id?.toString(),
          sender_role: msg.sender_role,
          message: msg.message,
          created_at: msg.created_at,
          read: msg.read,
          deleted: msg.deleted,
          deleted_at: msg.deleted_at,
          deleted_by: msg.deleted_by?.toString()
        })),
      user: user ? {
        _id: user._id?.toString(),
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar: user.avatar
      } : null,
      admin: admin ? {
        _id: admin._id?.toString(),
        name: admin.full_name || `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
        avatar: admin.avatar
      } : null,
      created_at: chat.created_at,
      updated_at: chat.updated_at
    }
  }

  // Tự động xóa/đóng chat không phản hồi sau 5 phút
  async cleanupInactiveChats() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    // Tìm tất cả chat pending
    const pendingChats = await databaseServices.chats.find({
      status: 'pending'
    }).toArray()

    // Lọc các chat không có admin trả lời và đã quá 5 phút
    const inactiveChats = pendingChats.filter(chat => {
      // Kiểm tra có tin nhắn từ admin không
      const hasAdminMessage = (chat.messages || []).some((msg: any) => msg.sender_role === 'admin')
      
      // Nếu không có admin trả lời và có last_customer_message_at
      if (!hasAdminMessage && chat.last_customer_message_at) {
        const lastMessageTime = new Date(chat.last_customer_message_at)
        return lastMessageTime < fiveMinutesAgo
      }
      
      // Nếu không có last_customer_message_at, kiểm tra tin nhắn cuối cùng
      if (!hasAdminMessage && chat.messages && chat.messages.length > 0) {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage.sender_role === 'customer') {
          const lastMessageTime = new Date(lastMessage.created_at)
          return lastMessageTime < fiveMinutesAgo
        }
      }
      
      return false
    })

    // Đóng các chat không phản hồi
    if (inactiveChats.length > 0) {
      const chatIds = inactiveChats.map(chat => chat._id)
      await databaseServices.chats.updateMany(
        { _id: { $in: chatIds } },
        {
          $set: {
            status: 'closed',
            updated_at: new Date()
          }
        }
      )
      console.log(`Closed ${inactiveChats.length} inactive chats (no response after 5 minutes)`)
    }

    return inactiveChats.length
  }

  // Admin xóa tin nhắn (soft delete) - có thể xóa tin nhắn của admin hoặc customer
  async deleteMessage(chat_id: string, message_id: string, admin_id: string) {
    const chatId = new ObjectId(chat_id)
    const messageId = new ObjectId(message_id)
    const adminId = new ObjectId(admin_id)
    
    const chat = await databaseServices.chats.findOne({ _id: chatId })
    if (!chat || !chat.messages) {
      throw new Error('Chat or message not found')
    }

    // Kiểm tra xem tin nhắn có tồn tại không
    const messageExists = chat.messages.some((msg: any) => msg._id?.toString() === message_id)
    if (!messageExists) {
      throw new Error('Message not found')
    }

    const updatedMessages = chat.messages.map((msg: any) => {
      if (msg._id?.toString() === message_id) {
        return {
          ...msg,
          deleted: true,
          deleted_at: new Date(),
          deleted_by: adminId,
        }
      }
      return msg
    })

    await databaseServices.chats.updateOne(
      { _id: chatId },
      {
        $set: {
          messages: updatedMessages,
          updated_at: new Date()
        }
      }
    )
  }

  // Admin khôi phục tin nhắn đã xóa
  async restoreMessage(chat_id: string, message_id: string) {
    const chatId = new ObjectId(chat_id)
    const messageId = new ObjectId(message_id)
    
    const chat = await databaseServices.chats.findOne({ _id: chatId })
    if (!chat || !chat.messages) {
      throw new Error('Chat or message not found')
    }

    const updatedMessages = chat.messages.map((msg: any) => {
      if (msg._id?.toString() === message_id) {
        return {
          ...msg,
          deleted: false,
          deleted_at: undefined,
          deleted_by: undefined,
        }
      }
      return msg
    })

    await databaseServices.chats.updateOne(
      { _id: chatId },
      {
        $set: {
          messages: updatedMessages,
          updated_at: new Date()
        }
      }
    )
  }

  // Xóa vĩnh viễn tin nhắn đã xóa quá 30 ngày
  async permanentlyDeleteOldMessages() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const chats = await databaseServices.chats.find({}).toArray()
    let deletedCount = 0

    for (const chat of chats) {
      if (!chat.messages || chat.messages.length === 0) continue

      const updatedMessages = chat.messages.filter((msg: any) => {
        // Xóa vĩnh viễn tin nhắn đã xóa quá 30 ngày
        if (msg.deleted && msg.deleted_at) {
          const deletedDate = new Date(msg.deleted_at)
          if (deletedDate < thirtyDaysAgo) {
            deletedCount++
            return false // Xóa khỏi mảng
          }
        }
        return true
      })

      if (updatedMessages.length !== chat.messages.length) {
        await databaseServices.chats.updateOne(
          { _id: chat._id },
          {
            $set: {
              messages: updatedMessages,
              updated_at: new Date()
            }
          }
        )
      }
    }

    if (deletedCount > 0) {
      console.log(`Permanently deleted ${deletedCount} old messages`)
    }

    return deletedCount
  }
}

export default new ChatService()

