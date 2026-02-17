import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import OnlineUsersSidebar from '../../components/messages/onlineUsersSidebar/OnlineUsersSidebar'
import MessagesList from '../../components/messages/messagesList/MessagesList'
import useSocket from '../../hooks/useSocket'
import { setupChatListeners } from '../../socket/chatListeners'

export default function Messages() {
    const socket = useSocket() // Get socket from context
    const [onlineUsers, setOnlineUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [privateMessages, setPrivateMessages] = useState({})
    const [userInfo, setUserInfo] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const messageRef = useRef()

    // Define handlers with useCallback
    const handleHistory = (data) => {

        const messages = data.messages || data
        const targetUserId = data.userId || data.otherUserId || selectedUser?.userId
        const fromUser = data.fromUser


        if (!fromUser) {
            return
        }

        if (!targetUserId) {
            return
        }


        // storing loaded messages
        setPrivateMessages(prev => {
            const formatted = messages.map(msg => (
                {
                    message: msg.message,
                    isMe: String(msg.fromUserId) === String(fromUser),
                    fromUserId: msg.fromUserId,
                    fromUsername: msg.fromUsername,
                    toUserId: msg.toUserId,
                    toUsername: msg.toUsername,
                    timestamp: msg.createdAt
                }))

            return {
                ...prev,
                [targetUserId]: formatted
            }
        })
    }

    const handleReceiveMessage = (data) => {

        setPrivateMessages(prev => {
            const existing = prev[data.fromUserId] || []

            return {
                ...prev,
                [data.fromUserId]: [...existing, {
                    message: data.message,
                    fromUserId: data.fromUserId,
                    fromUsername: data.fromUsername,
                    isMe: false,
                    timestamp: data.timestamp
                }]
            }
        })
    }

    useEffect(() => {
        // check if socket avaliable
        if (!socket) {
            setIsLoading(true)
            return
        }



        // Set initial connection status
        setIsConnected(socket.connected)

        // Connection status
        const handleConnect = () => {
            setIsConnected(true)
        }

        const handleDisconnect = () => {
            console.log('Socket disconnected in Messages component')

            setIsConnected(false)
            setOnlineUsers([])
            setSelectedUser(null)

        }

        // User info
        const handleChatConnected = (data) => {

            setUserInfo({
                userId: data.userId,
                username: data.username
            })
            setIsLoading(false)

        }

        // User joined
        const handleUserJoined = (newUser) => {

            setOnlineUsers(prev => {
                if (userInfo && newUser.userId === userInfo.userId) return prev
                if (prev.some(user => user.userId === newUser.userId)) return prev
                return [...prev, newUser]
            })
        }

        // User left
        const handleUserLeft = (leftUser) => {

            setOnlineUsers(prev => prev.filter(user => user.userId !== leftUser.userId))
            if (selectedUser?.userId === leftUser.userId) {
                setSelectedUser(null)
            }
        }

        // Online users list
        const handleOnlineUsersList = (users) => {

            setOnlineUsers(users)
        }

        // Online users updated
        const handleOnlineUsersUpdated = (users) => {

            console.log('👥 Online users updated:', users)
            if (userInfo) {
                const filtered = users.filter(user => user.userId !== userInfo.userId)
                setOnlineUsers(filtered)
            } else {
                setOnlineUsers(users)
            }
        }

        // Error handler
        const handleError = (errorData) => {

            console.error('Socket error:', errorData)
            if (errorData.type === 'user_offline') {
                alert('User is offline')
            }
        }

        // Handle current user response (if you add this on backend)
        const handleCurrentUser = (data) => {

            setUserInfo({
                userId: data.userId,
                username: data.username
            })
            setIsLoading(false)

        }

        // Remove existing listeners first
        socket.off('connect', handleConnect)
        socket.off('disconnect', handleDisconnect)
        socket.off('chat:connected', handleChatConnected)
        socket.off('user:joined', handleUserJoined)
        socket.off('user:left', handleUserLeft)
        socket.off('online-users-list', handleOnlineUsersList)
        socket.off('online-users-updated', handleOnlineUsersUpdated)
        socket.off('error', handleError)
        socket.off('private-history', handleHistory)
        socket.off('receive-private-message', handleReceiveMessage)
        socket.off('current-user', handleCurrentUser)

        // Register all listeners
        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)
        socket.on('chat:connected', handleChatConnected)
        socket.on('user:joined', handleUserJoined)
        socket.on('user:left', handleUserLeft)
        socket.on('online-users-list', handleOnlineUsersList)
        socket.on('online-users-updated', handleOnlineUsersUpdated)
        socket.on('error', handleError)
        socket.on('current-user', handleCurrentUser)

        setupChatListeners(socket, {
            onHistory: handleHistory,
            onReceiveMessage: handleReceiveMessage
        })

        // If socket is already connected, request user info
        if (socket.connected) {
            socket.emit('get-current-user')
            socket.emit('get-online-users')
        }

        return () => {
            socket.off('connect', handleConnect)
            socket.off('disconnect', handleDisconnect)
            socket.off('chat:connected', handleChatConnected)
            socket.off('user:joined', handleUserJoined)
            socket.off('user:left', handleUserLeft)
            socket.off('online-users-list', handleOnlineUsersList)
            socket.off('online-users-updated', handleOnlineUsersUpdated)
            socket.off('error', handleError)
            socket.off('current-user', handleCurrentUser)
            socket.off('private-history', handleHistory)
            socket.off('receive-private-message', handleReceiveMessage)
        }
    }, [socket])

    // Request history when user is selected
    useEffect(() => {
        if (socket && selectedUser && userInfo) {
            console.log('Requesting history for user:', selectedUser.userId)
            socket.emit('get-private-history', selectedUser.userId)
        }
    }, [socket, selectedUser, userInfo])

    const sendPrivateMessage = () => {
        if (!selectedUser) {
            alert('Please select a user to message')
            return
        }
        if (!messageRef.current?.value.trim() || !socket) {
            return
        }

        const messageText = messageRef.current.value
        const timestamp = new Date().toISOString()

        // Optimistically add message to UI
        setPrivateMessages(prev => {
            const existing = prev[selectedUser.userId] || []
            return {
                ...prev,
                [selectedUser.userId]: [...existing, {
                    message: messageText,
                    toUserId: selectedUser.userId,
                    toUsername: selectedUser.username,
                    isMe: true,
                    timestamp: timestamp
                }]
            }
        })

        socket.emit('send-private-message', {
            toUserId: selectedUser.userId,
            message: messageText
        })

        messageRef.current.value = ''
        messageRef.current.focus()
    }

    const getMessagesForUser = (userId) => {
        return privateMessages[userId] || []
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Show loading state
    if (isLoading || !isConnected || !userInfo) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh'
            }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 fs-5">Connecting to chat server...</p>
                    {!socket && <p className="text-muted">Waiting for socket...</p>}
                    {socket && !socket.connected && <p className="text-muted">Connecting...</p>}
                    {socket?.connected && !userInfo && <p className="text-muted">Getting user info...</p>}
                </div>
            </div>
        )
    }

    return (

        <Container className="d-flex gap-1" style={{ height: '80vh' }}>
            {/* Online Users Sidebar */}

            <OnlineUsersSidebar
                onlineUsers={onlineUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />


            {/* Chat Area */}
            <div className="flex-grow-1 d-flex flex-column p-1" style={{ border: '1px solid gray' }}>
                {selectedUser ? (
                    <>
                        {/* chat display header */}
                        <div className="pb-3 border-bottom mb-3 d-flex justify-content-between align-items-center" >
                            <div>
                                <h4 className="m-0" >
                                    Chat with {selectedUser.username}
                                </h4>
                                <small className="text-success">
                                    ● Online now
                                </small>
                            </div>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setSelectedUser(null)}
                            >
                                Back
                            </Button>
                        </div>


                        <MessagesList
                            messages={getMessagesForUser(selectedUser.userId)}
                            selectedUser={selectedUser}
                            formatTime={formatTime}
                        />

                        {/* message input */}
                        <div className="d-flex gap-2">
                            <Form.Control
                                ref={messageRef}
                                type='text'
                                placeholder={`Message ${selectedUser.username}...`}
                            />
                            <Button onClick={sendPrivateMessage}>
                                Send
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center text-center text-muted h-100">
                        <div>
                            <h4>Welcome, {userInfo.username}!</h4>
                            <p>Select a user from the list to start chatting</p>
                        </div>

                        <div className='text-center mt-5'>
                            <div className='d-flex align-items-center justify-content-center'>
                                <h1 className="display-1 fw-bolder text-primary">ZBOOK</h1>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </Container>
    )
}