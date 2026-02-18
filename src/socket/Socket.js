// socket/socket.js
import { io } from "socket.io-client"

let socket = null

export function connectSocket(token) {
    if (socket && socket.connected) {
        return socket
    }
    
    // If socket exists but is disconnected, clean it up
    if (socket) {
        socket.disconnect()
        socket = null
    }

    socket = io(import.meta.env.VITE_BACKEND_BASE, {
        auth: {
            token: `Bearer ${token}`
        },
        withCredentials: true,
        transports: ['websocket'],
    })

    return socket
}

export function getSocket() {
    return socket
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}