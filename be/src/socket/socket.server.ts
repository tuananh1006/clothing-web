import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import databaseServices from '~/services/database.services'
import chatServices from '~/services/chat.services'
import { UserRole, UserVerifyStatus } from '~/constants/enums'

interface SocketAuth {
  userId: string
  role: string
}

// Store active connections
const userSockets = new Map<string, Socket[]>() // userId -> Socket[]
const adminSockets = new Map<string, Socket>() // adminId -> Socket

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  })

  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
      
      // JWT token uses userId (camelCase), not user_id
      const userId = decoded.userId
      
      if (!userId) {
        return next(new Error('Authentication error: Invalid token payload'))
      }

      // Get user from database to get role
      const user = await databaseServices.users.findOne({ _id: new ObjectId(userId) })
      
      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      // Check if user is banned
      if (user.verify === UserVerifyStatus.Banned) {
        return next(new Error('Authentication error: Account is banned'))
      }
      
      socket.data.userId = userId
      socket.data.role = user.role || UserRole.Customer
      
      next()
    } catch (error: any) {
      console.error('Socket authentication error:', error.message)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', async (socket: Socket) => {
    const userId = socket.data.userId
    const role = socket.data.role

    console.log(`Socket connected: ${userId} (${role})`)

    // Join user's room
    socket.join(`user:${userId}`)

    if (role === UserRole.Admin) {
      // Admin joins admin room
      socket.join('admin')
      adminSockets.set(userId, socket)
      console.log(`Admin ${userId} connected`)
    } else {
      // Customer: add to user sockets map
      if (!userSockets.has(userId)) {
        userSockets.set(userId, [])
      }
      userSockets.get(userId)?.push(socket)
    }

    // Customer: Join chat room (chỉ join nếu đã có chat với tin nhắn)
    if (role !== UserRole.Admin) {
      try {
        const chat = await chatServices.getOrCreateChat(userId)
        if (chat) {
          socket.join(`chat:${chat._id}`)
          console.log(`User ${userId} joined chat room: ${chat._id}`)
        }
        // Nếu chưa có chat, không join room - sẽ join khi gửi tin nhắn đầu tiên
      } catch (error) {
        console.error('Error joining chat room:', error)
      }
    }

    // Handle admin join chat room
    socket.on('join_chat', async (data: { chat_id: string }) => {
      if (role === UserRole.Admin) {
        socket.join(`chat:${data.chat_id}`)
        console.log(`Admin ${userId} joined chat room: ${data.chat_id}`)
      }
    })

    // Handle send message (customer)
    socket.on('chat:send_message', async (data: { message: string }) => {
      try {
        if (role === UserRole.Admin) {
          socket.emit('chat:error', { message: 'Admins cannot send messages as customers' })
          return
        }

        const sentMessage = await chatServices.sendMessage(userId, data.message, 'customer')
        
        // Get chat sau khi đã gửi tin nhắn (chat đã được tạo trong sendMessage)
        const chat = await databaseServices.chats.findOne({
          user_id: new ObjectId(userId),
          status: { $in: ['open', 'pending'] }
        })
        
        if (chat) {
          // Join chat room nếu chưa join
          socket.join(`chat:${chat._id.toString()}`)
          
          // Emit to user
          io.to(`chat:${chat._id.toString()}`).emit('chat:new_message', sentMessage)
          
          // Notify admins
          io.to('admin').emit('chat:new_customer_message', {
            chat_id: chat._id.toString(),
            user_id: userId,
            message: sentMessage,
          })
        }
      } catch (error: any) {
        socket.emit('chat:error', { message: error.message || 'Failed to send message' })
      }
    })

    // Handle admin send message
    socket.on('chat:admin_send_message', async (data: { chat_id: string; message: string }) => {
      try {
        if (role !== UserRole.Admin) {
          socket.emit('chat:error', { message: 'Only admins can send admin messages' })
          return
        }

        // Get chat detail to find user_id
        const chatDetail = await chatServices.getChatDetail(data.chat_id)
        const sentMessage = await chatServices.sendMessage(
          chatDetail.user_id,
          data.message,
          'admin',
          userId
        )

        // Emit to chat room (both user and admin)
        io.to(`chat:${data.chat_id}`).emit('chat:new_message', sentMessage)
        
        // Notify admins
        io.to('admin').emit('chat:new_admin_message', {
          chat_id: data.chat_id,
          message: sentMessage,
        })
      } catch (error: any) {
        socket.emit('chat:error', { message: error.message || 'Failed to send message' })
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${userId} (${role})`)
      
      if (role === UserRole.Admin) {
        adminSockets.delete(userId)
      } else {
        const sockets = userSockets.get(userId)
        if (sockets) {
          const index = sockets.indexOf(socket)
          if (index > -1) {
            sockets.splice(index, 1)
          }
          if (sockets.length === 0) {
            userSockets.delete(userId)
          }
        }
      }
    })
  })

  return io
}

// Helper function to emit to user
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data)
}

// Helper function to emit to admins
export const emitToAdmins = (io: SocketIOServer, event: string, data: any) => {
  io.to('admin').emit(event, data)
}

