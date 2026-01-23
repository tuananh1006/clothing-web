import { Router } from 'express'
import {
  getOrCreateChatController,
  sendMessageController,
  getMessagesController,
  closeChatController,
  markAsReadController
} from '~/controllers/chat.controller'
import { accessTokenValidator } from '~/middlewares/users.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const chatRouter = Router()

// Customer routes
chatRouter.get('/', accessTokenValidator, wrapRequestHandler(getOrCreateChatController))
chatRouter.post('/messages', accessTokenValidator, wrapRequestHandler(sendMessageController))
chatRouter.get('/messages', accessTokenValidator, wrapRequestHandler(getMessagesController))
chatRouter.post('/close', accessTokenValidator, wrapRequestHandler(closeChatController))
chatRouter.post('/mark-read', accessTokenValidator, wrapRequestHandler(markAsReadController))

export default chatRouter

