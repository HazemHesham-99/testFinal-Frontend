import React, { useState, useRef, useEffect } from 'react'
import { Overlay, Popover, Badge, Button, ListGroup } from 'react-bootstrap'
import { FaRegBell, FaBell } from "react-icons/fa6";
import useSocket from '../../hooks/useSocket'
import { useNotifications } from '../../store/context/NotificationContext'

export default function NotificationBell() {
    //control to show Notification list
    const [show, setShow] = useState(false)
    const target = useRef(null)
    const socket = useSocket()
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications
    } = useNotifications()

    // Fetch notifications when socket is ready
    useEffect(() => {
        if (socket) {
            fetchNotifications()
        }
    }, [socket])

    //onclick for notification
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id)
        }

        setShow(false)
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case "MESSAGE":
                return '💬'
            case 'LIKE':
                return '❤️'
            case 'COMMENT':
                return '📝'

            default:
                return '🔔'
        }
    }

    return (
        <>
            <Button
                ref={target}
                onClick={() => setShow(!show)}
                className="position-relative text-dark"
            >
                <div className='text-white'>
                    {unreadCount > 0 ? <FaBell size={20} /> : <FaRegBell size={20} />}
                </div>
                {unreadCount > 0 && (
                    <Badge
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>

            <Overlay
                show={show}
                target={target.current}
                placement="bottom-end"
                rootClose
                onHide={() => setShow(false)}
            >
                <Popover  id="notification-popover" style={{ maxWidth: '350px' ,  backgroundColor: 'var(--card-bg)'}}>
                    <Popover.Header as="h3" className="  d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--card-bg)' }}>
                        Notifications
                        {notifications.length > 0 && (
                            <Button
                                variant="link"
                                size="sm"
                                onClick={markAllAsRead}
                                className="p-0 text-muted"
                                style={{ fontSize: '0.8rem' }}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </Popover.Header>
                    <Popover.Body className="p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div className="text-center p-4 text-muted">
                                No notifications
                            </div>
                        ) : (
                            <ListGroup >
                                {notifications.map(notification => (
                                    <ListGroup.Item
                                        key={notification._id}
                                        action
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`d-flex align-items-start gap-2 ${!notification.isRead ? 'fw-bold bg-primary ' : ''}`}
                                        style={{ cursor: 'pointer' ,  backgroundColor: 'var(--card-bg)' , color: 'var(--text)' }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="flex-grow-1">
                                            
                                            <div>{notification.message}</div>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Popover.Body>
                </Popover>
            </Overlay>
        </>
    )
}