// socket/notificationListeners.js
export function setupNotificationListeners(socket, handlers) {
    if (!socket) return

    // Listen for new notifications
    socket.on('notification:new', (notification) => {
        console.log('🔔 New notification:', notification)
        handlers.onNewNotification(notification)
    })

    // Listen for initial notification list
    socket.on('notification:list', (notifications) => {
        console.log('📋 Notification list:', notifications)
        handlers.onNotificationList(notifications)
    })

    // Listen for notification read updates
    socket.on('notification:read', (data) => {
        console.log('✓ Notification read:', data)
        // You can handle this if needed
    })

    // Listen for notification count update
    socket.on('notification:count', (data) => {
        console.log('🔢 Notification count:', data.count)
        handlers.onUnreadCountUpdate?.(data.count)
    })
}

export function cleanupNotificationListeners(socket) {
    if (!socket) return
    
    socket.off('notification:new')
    socket.off('notification:list')
    socket.off('notification:read')
    socket.off('notification:count')
}