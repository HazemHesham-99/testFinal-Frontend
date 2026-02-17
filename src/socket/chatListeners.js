export function setupChatListeners(socket, handlers) {

   


    socket.on("private-history", handlers.onHistory)

    socket.on("receive-private-message", handlers.onReceiveMessage)
}
