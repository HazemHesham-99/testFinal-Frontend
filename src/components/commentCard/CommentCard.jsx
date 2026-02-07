import React, { useRef, useState } from 'react';
import { Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { useSelector } from 'react-redux';
import { api } from '../../APIS/api';
import toast from 'react-hot-toast';
import GeneralComment from '../generalComment/GeneralComment';

function CommentCard({ comment, setDeletedComment }) {
    const { user } = useSelector((state) => state.user)

    const [isOpen, setIsOpen] = useState(false);
    const [showedit, setShowEdit] = useState(false)
    const [commentText, setCommentText] = useState(comment.text)
    const [updatedComment, setUpdatedComment] = useState(comment.text)


    async function handleEdit(text) {
        const id = comment._id
        const token = localStorage.getItem("token")
        console.log(text)
        try {
            const response = await api.put(`/api/v1/comment/${id}/update`, { text }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUpdatedComment(response.data.comment.text)
            toast.success(response.data.message)
            setShowEdit(false)
        } catch (error) {
            console.log(error)
        }
    }


    async function handleDelete() {
        const id = comment._id

        try {
            const response = await api.delete(`/api/v1/comment/${id}`)
            console.log(response)
            toast.success(response.data.message)
            setDeletedComment(id)
        } catch (error) {
            console.log(error)
        } finally {
            setIsOpen(false); // Close menu after selection

        }
    }

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes}m ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <Card className="mb-2 border-0">
            <Card.Body className="p-3">
                <div className="d-flex">
                    {/* User Avatar */}
                    <img
                        src={`${import.meta.env.VITE_BACKEND_BASE}/${comment.userId.profilePic}`}
                        alt={comment.userId.name}
                        className="rounded-circle me-3"
                        style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            flexShrink: 0
                        }}
                    />

                    {/* Comment Content */}
                    <div className="flex-grow-1">
                        {/* Comment Header */}
                        <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                                <h6 className="mb-0 fw-bold d-inline">{comment.userId.name}</h6>
                                <small className="text-muted ms-2">{formatTimeAgo(comment.createdAt)}</small>
                            </div>
                            {/* option button */}
                            <button className="btn btn-link text-muted p-0" onClick={() => setIsOpen(!isOpen)}
                            >
                                {(comment.userId._id == user._id) && <MoreVertical size={16} />}
                            </button>

                        </div>

                        {/* Comment Text */}
                        <p className="mb-2">{updatedComment}</p>
                        {showedit && (
                            <div 
                            className="d-flex align-items-baseline gap-2"
                            >
                                <GeneralComment commentText={commentText} handleSubmit={handleEdit} setCommentText={setCommentText} />
                                <Button className="btn btn-secondary" onClick={()=>{setShowEdit(false)}}>Cancel</Button>
                            </div>)}
                        {/* Comment Actions */}
                        <div className="d-flex align-items-center">
                            {/* <button className="btn btn-link text-muted p-0 me-3 text-decoration-none">
                                <ThumbsUp size={16} className="me-1" />
                                <small>{comment.likes.length}</small>
                            </button>
                            <button className="btn btn-link text-muted p-0 text-decoration-none">
                                <Reply size={16} className="me-1" />
                                <small>Reply</small>
                            </button> */}
                        
                        </div>


                    </div>
                    {isOpen && (
                        <div className="position-absolute end-0 mt-4 bg rounded shadow-sm border z-3 p-1">
                            <div className=" m-2">
                                <button
                                    onClick={() => {
                                        setShowEdit(true)
                                        setIsOpen(false); // Close menu after selection
                                    }}
                                    className="btn btn-outline-primary px-3 py-2 w-100 "
                                >
                                    Edit
                                </button>

                                <hr className="my-1" />
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-outline-danger px-3 py-2 w-100 "
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </Card.Body>
        </Card>
    );
}

export default CommentCard;