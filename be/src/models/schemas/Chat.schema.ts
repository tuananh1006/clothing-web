import { ObjectId } from 'mongodb'

interface ChatType {
  _id?: ObjectId
  user_id: ObjectId
  admin_id?: ObjectId
  messages: ChatMessage[]
  status: 'open' | 'closed' | 'pending' // Giữ lại để backward compatibility
  viewed?: boolean // Đã xem hay chưa
  viewed_at?: Date // Thời gian admin xem lần cuối
  last_customer_message_at?: Date // Thời gian tin nhắn cuối từ customer
  created_at?: Date
  updated_at?: Date
}

interface ChatMessage {
  _id?: ObjectId
  sender_id: ObjectId
  sender_role: 'customer' | 'admin'
  message: string
  created_at: Date
  read?: boolean
  deleted?: boolean // Đã xóa hay chưa
  deleted_at?: Date // Thời gian xóa
  deleted_by?: ObjectId // Ai đã xóa (admin_id)
}

export default class Chat {
  _id: ObjectId
  user_id: ObjectId
  admin_id?: ObjectId
  messages: ChatMessage[]
  status: 'open' | 'closed' | 'pending'
  viewed?: boolean
  viewed_at?: Date
  last_customer_message_at?: Date
  created_at: Date
  updated_at: Date

  constructor(chat: ChatType) {
    this._id = chat._id || new ObjectId()
    this.user_id = chat.user_id
    this.admin_id = chat.admin_id
    this.messages = chat.messages || []
    this.status = chat.status || 'open'
    this.viewed = chat.viewed || false
    this.viewed_at = chat.viewed_at
    this.last_customer_message_at = chat.last_customer_message_at
    this.created_at = chat.created_at || new Date()
    this.updated_at = chat.updated_at || new Date()
  }
}

export type { ChatMessage }

