import React from 'react'

export default function MessagesList({ messages, selectedUser, formatTime }) {

    if (!selectedUser) return null

    return (
        <div
            className="flex-grow-1 overflow-auto p-3 rounded mb-3"
            style={{ backgroundColor: 'var(--card-bg)' }}
        >
            {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <p>Say hello to {selectedUser.username}</p>
                </div>
            ) : (
                messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`d-flex ${msg.isMe ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                    >
                        <div
                            className="p-3 rounded-3"
                            style={{
                                maxWidth: '70%',
                                backgroundColor: msg.isMe ? '#007bff' : '#e9ecef',
                                color: msg.isMe ? 'white' : 'black',
                            }}
                        >
                            <div>{msg.message}</div>

                            <div className="small text-end mt-2 opacity-50">
                                {formatTime(msg.timestamp)}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
