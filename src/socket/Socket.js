// import { io } from "socket.io-client"

// let socket = null

// export function connectSocket(token) {
//     if (socket) return socket

//     socket = io(import.meta.env.VITE_BACKEND_BASE, {
//         auth: {
//             token: `Bearer ${token}`
//         },
//         withCredentials: true,
//         transports: ['websocket']
//     })

//     return socket
// }

// export function getSocket() {
//     return socket
// }

// export function disconnectSocket() {
//     if (socket) {
//         socket.disconnect()
//         socket = null
//     }
// }


// socket/socket.js
import { io } from "socket.io-client"

let socket = null

export function connectSocket(token) {
    if (socket && socket.connected) {
        console.log('Returning existing socket connection')
        return socket
    }
    
    // If socket exists but is disconnected, clean it up
    if (socket) {
        console.log('Cleaning up disconnected socket')
        socket.disconnect()
        socket = null
    }

    console.log('Creating new socket connection')
    socket = io(import.meta.env.VITE_BACKEND_BASE, {
        auth: {
            token: `Bearer ${token}`
        },
        withCredentials: true,
        transports: ['websocket'],
        // reconnection: true,
        // reconnectionAttempts: 5,
        // reconnectionDelay: 1000,
        // reconnectionDelayMax: 5000
    })

    return socket
}

export function getSocket() {
    return socket
}

export function disconnectSocket() {
    if (socket) {
        console.log('Disconnecting socket')
        socket.disconnect()
        socket = null
    }
}