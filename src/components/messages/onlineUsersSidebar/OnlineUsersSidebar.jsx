import React from 'react'
import { Card } from 'react-bootstrap'
import useSocket from '../../../hooks/useSocket'

export default function OnlineUsersSidebar({
    onlineUsers,
    selectedUser,
    setSelectedUser,
    
}) {
    const socket = useSocket()

    return (
        <Card className="bg overflow-auto border-end" style={{ width: '250px' }}>
            <div className="p-3 border-bottom">
                <h5 className="m-0">
                    👥 Online ({onlineUsers.length})
                </h5>
            </div>

            {onlineUsers.length === 0 ? (
                <div className="p-4 text-center text-muted">
                    <p>No other users online</p>
                </div>
            ) : (
                <div>
                    {onlineUsers.map(user => (
                        <div
                            key={user.userId}
                            onClick={() => {
                                setSelectedUser(user)
                                socket.emit("load-private-history", {
                                    otherUserId: user.userId
                                })
                            }}
                            className="fw-medium p-3 border-bottom d-flex align-items-center"
                            style={{
                                cursor: 'pointer',
                                backgroundColor: selectedUser?.userId === user.userId ? 'var(--primary)' : 'transparent',
                                color: selectedUser?.userId === user.userId ? 'white' : 'var(--text)',
                            }}
                        >
                            {user.username}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}
