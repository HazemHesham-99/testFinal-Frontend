import React, { createContext, useContext, useState, useEffect } from 'react'
import useSocket from '../../hooks/useSocket'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
    const socket = useSocket()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showNotifications, setShowNotifications] = useState(false)

    // ===== SET UP SOCKET LISTENERS =====
    useEffect(() => {
        if (!socket) {
            return
        }


        // Handle new notification
        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev])
            if (!notification.isRead) {
                setUnreadCount(prev => prev + 1)
            }
        }

        // Handle notification list
        const handleNotificationList = (list) => {
            setNotifications(list)
            const unread = list.filter(n => !n.isRead).length
            setUnreadCount(unread)
        }

        // Handle unread count update
        const handleNotificationCount = ({ count }) => {
            setUnreadCount(count)
        }

      
        // Register listeners
        socket.on('notification:new', handleNewNotification)
        socket.on('notification:list', handleNotificationList)
        socket.on('notification:count', handleNotificationCount)

        // Request initial notifications
        socket.emit('notification:fetch')

        // Clean up
        return () => {
            socket.off('notification:new', handleNewNotification)
            socket.off('notification:list', handleNotificationList)
            socket.off('notification:count', handleNotificationCount)
        }
    }, [socket])

    // Mark notification as read
    const markAsRead = (notificationId) => {
        if (!socket) return
        
        socket.emit('notification:read', { notificationId })
        
        //  update UI
        setNotifications(prev =>
            prev.map(notif =>
                notif._id === notificationId
                    ? { ...notif, isRead: true }
                    : notif
            )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
    }

    // Mark all as read
    const markAllAsRead = () => {
        if (!socket) return
        
        socket.emit('notification:read-all')
        
        // Optimistically update UI
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        )
        setUnreadCount(0)
    }

    // Clear notification
    const clearNotification = (notificationId) => {
        setNotifications(prev =>
            prev.filter(notif => notif._id !== notificationId)
        )
    }

    // Fetch notifications
    const fetchNotifications = () => {
        if (!socket) return
        socket.emit('notification:fetch')
    }

    // to use them at notification comp
    const value = {
        notifications,
        unreadCount,
        showNotifications,
        setShowNotifications,
        markAsRead,
        markAllAsRead,
        clearNotification,
        fetchNotifications
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}
        // put at app
export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider')
    }
    return context
}