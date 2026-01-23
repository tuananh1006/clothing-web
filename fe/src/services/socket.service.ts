import { io, Socket } from 'socket.io-client'

// Get API base URL (without /api/v1)
const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
  // Remove /api/v1 to get base URL
  return apiUrl.replace('/api/v1', '')
}

let socket: Socket | null = null

export const getSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket
  }

  socket = io(getBaseURL(), {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export default { getSocket, disconnectSocket }

