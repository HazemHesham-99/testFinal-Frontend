import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import io from 'socket.io-client'
import OnlineUsersSidebar from '../../components/messages/onlineUsersSidebar/OnlineUsersSidebar'
import MessagesList from '../../components/messages/messagesList/MessagesList'

export default function Messages() {
    const socketRef = useRef(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [privateMessages, setPrivateMessages] = useState({})
    const [userInfo, setUserInfo] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const messageRef = useRef()


    useEffect(() => {
        const token = localStorage.getItem('token')
        console.log('Token:', token ? 'Found' : 'Not found')


        //CHECK TOKEN
        if (!token) {
            alert('Please login first')
            window.location.href = '/login'
            return
        }


        // Disconnect existing socket if any BEFORE REconnect
        if (socketRef.current) {
            socketRef.current.disconnect()
        }

        //intialize socket io (backened connection string + token)
        socketRef.current = io(import.meta.env.VITE_BACKEND_BASE, {
            auth: {
                token: `Bearer ${token}`
            },
            withCredentials: true,
            transports: ['websocket', 'polling']
        })

        //connected to socket io server
        socketRef.current.on('connect', () => {
            setIsConnected(true)
        })

        // entered chat
        socketRef.current.on('chat:connected', (data) => {
            setUserInfo({
                userId: data.userId,
                username: data.username
            })

        })

        // ✅ Listen for user joined events
        socketRef.current.on('user:joined', (newUser) => {
            setOnlineUsers(prev => {
                // Don't add if already in list or if it's yourself
                if (userInfo && newUser.userId === userInfo.userId) {
                    return prev
                }
                if (prev.some(user => user.userId === newUser.userId)) {
                    return prev
                }
                return [...prev, newUser]
            })
        })

        // ✅ Listen for user left events
        socketRef.current.on('user:left', (leftUser) => {
            console.log('👋 User left:', leftUser)
            setOnlineUsers(prev => prev.filter(user => user.userId !== leftUser.userId))

            // If we were chatting with this user, deselect them
            if (selectedUser?.userId === leftUser.userId) {
                setSelectedUser(null)
            }
        })

        // ✅ Listen for initial online users list
        socketRef.current.on('online-users-list', (users) => {
            console.log('👥 Online users list:', users)
            // Backend already excludes self, so just set the list
            setOnlineUsers(users)
        })

        // ✅ Keep this for backward compatibility
        socketRef.current.on('online-users-updated', (users) => {
            console.log('👥 Online users updated:', users)
            // Filter out self if needed
            if (userInfo) {
                const filtered = users.filter(user => user.userId !== userInfo.userId)
                setOnlineUsers(filtered)
            } else {
                setOnlineUsers(users)
            }
        })

        socketRef.current.on('connect_error', (error) => {
            console.error('🔴 Connection error:', error.message)
            setIsConnected(false)

            if (error.message.includes('token') || error.message.includes('auth')) {
                alert('Authentication failed. Please login again.')
                window.location.href = '/login'
            }
        })

        //listen for history
        socketRef.current.on("private-history", (data) => {
            console.log('Received private history:', data)

            const messages = data.messages || data
            const targetUserId = data.userId || data.otherUserId || selectedUser?.userId
            const fromUser = data.fromUser


            if (!fromUser) {
                console.log("UserInfo not ready yet")
                return
            }

            if (!targetUserId) {
                console.error('No userId provided in private-history event')
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
        })


        // recive message from other user
        socketRef.current.on('receive-private-message', (data) => {
            console.log('📩 Received private message:', data)

            //add to existed chat
            setPrivateMessages(prev => {
                const existing = prev[data.fromUserId] || []
                return {
                    ...prev,
                    [data.fromUserId]: [...existing, {
                        message: data.message,
                        fromUserId: data.fromUserId,
                        isMe: false,
                        timestamp: data.timestamp
                    }]
                }
            })
        })


        socketRef.current.on('error', (errorData) => {
            console.error('Socket error:', errorData)
            if (errorData.type === 'user_offline') {
                alert('User is offline')
            }
        })

        socketRef.current.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason)
            setIsConnected(false)
            setOnlineUsers([])
            setSelectedUser(null)
        })

        return () => {
            console.log('🧹 Cleaning up socket connection')
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, []) // Empty dependency array - only run once



    const sendPrivateMessage = () => {
        if (!selectedUser) {
            alert('Please select a user to message')
            return
        }
        if (!messageRef.current?.value.trim()) {
            return
        }

        const messageText = messageRef.current.value
        const timestamp = new Date()

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

        // ✅ Use correct event name 'send-private-message'
        socketRef.current.emit('send-private-message', {
            toUserId: selectedUser.userId,
            message: messageText
        })

        // Clear input
        messageRef.current.value = ''
        messageRef.current.focus()
    }

    // ✅ Add manual refresh function


    const getMessagesForUser = (userId) => {
        return privateMessages[userId] || []
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    if (!isConnected || !userInfo) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
            }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Connecting to chat server...</p>
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
                socketRef={socketRef}
            />


            {/* Chat Area */}
            <div className="flex-grow-1 d-flex flex-column p-4" style={{ border: '1px solid gray' }}>
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