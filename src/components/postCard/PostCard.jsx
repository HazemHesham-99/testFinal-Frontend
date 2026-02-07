import React, { useState } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import moment from 'moment';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { api } from '../../APIS/api';
import { useSelector } from 'react-redux';
import CommentPage from '../comment/Comment';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import GeneralComment from '../generalComment/GeneralComment';
import toast from 'react-hot-toast';

export default function SimplePostCard({ post, onOpenModel, setdeletePost }) {

    const [currentPost, setCurrentPost] = useState(post)
    const [isOpen, setIsOpen] = useState(false);
    const [showedit, setShowEdit] = useState(false)
    const [updatedcaption, setUpdatedcaption] = useState(post.caption)

    const { user, isLoggedIn } = useSelector((state) => state.user)
    const go = useNavigate()
    var isLiked = false;
    if (isLoggedIn) {
        isLiked = currentPost.likes.includes(user._id);
    }

    //check with backened if liked or not
    async function handleLike(id) {
        try {
            const response = await api.put(`/api/v1/posts/${id}/like`, {})
            setCurrentPost(response.data.post)
        } catch (error) {
            console.log(error)
        }

    }

    //send to database updated post
    async function handleEditPost() {
        const id = post._id

        try {
            const response = await api.put(`/api/v1/posts/${id}`, { text: updatedcaption })
            setCurrentPost(response.data.post)
            setShowEdit(false)
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
        }

    }

    async function handleDeletePost () {
        const id = post._id
        console.log(id)

        try {
            const response = await api.delete(`/api/v1/posts/${id}`)
            toast.success(response.data.message)
            setdeletePost(true)
        } catch (error) {
            console.log(error)
        } finally {
            setIsOpen(false); // Close menu after selection

        }
        
    }

    return (
        <div className="card mb-4">
            {/* Header */}
            <div className="card-header d-flex justify-content-between align-items-start mb-1">

                <div className=" d-flex align-items-center ">
                    {/* user pp */}
                    <img
                        src={`${import.meta.env.VITE_BACKEND_BASE}/${post.userId.profilePic}`}
                        alt={post.userId.name}
                        className="rounded-circle me-2"
                        width={40}
                        height={40}
                    />
                    <div>
                        <h6 className="mb-0">{post.userId.name}</h6>
                        <small className="text-muted">
                            {moment(post.createdAt).fromNow()}                    </small>
                    </div>
                </div>

                {/* sub-menu that show edit and delete */}
                {isLoggedIn && <button className="btn btn-link text-muted p-0" onClick={() => setIsOpen(!isOpen)}
                >
                    {(post.userId._id == user._id) && <MoreVertical size={16} />}
                </button>}
            </div>

            {/* Images of the post*/}
            {(post.images.length!=0) && (<div className="card-body p-0">
                 <Carousel>
                    {post.images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                key={index}
                                src={`${import.meta.env.VITE_BACKEND_BASE}/${image}`}
                                alt={`Post ${index + 1}`}
                                className="img-fluid w-100"
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>)}

            {/* Actions */}
            <div className="card-footer">
                <div className="d-flex gap-3 mb-2">
                    {/* like button */}
                    <button onClick={() => { isLoggedIn ? handleLike(currentPost._id) : go("/login") }} className="btn btn-link p-0">
                        {isLiked ? (
                            <FaHeart className="text-danger" />
                        ) : (
                            <FaRegHeart />
                        )}
                    </button>

                    {/* comment button */}
                    <button className="btn btn-link p-0" onClick={() => { isLoggedIn ? onOpenModel(post) : go("/login") }}>
                        <FaComment />
                    </button>
                </div>

                {/* like length */}
                <p className="mb-1 fw-bold">
                    {currentPost.likes.length} likes
                </p>

                <p className="mb-0">
                    <span className="fw-bold">{post.userId.name}</span> {currentPost.caption}
                </p>

                {showedit && (
                    <div
                        className="d-flex align-items-baseline gap-2"
                    >
                        <GeneralComment commentText={updatedcaption} handleSubmit={handleEditPost} setCommentText={setUpdatedcaption} />
                        <Button className="btn btn-secondary" onClick={() => { setShowEdit(false) }}>Cancel</Button>
                    </div>)}
            </div>

            {/* submenu that shows delete and edit */}
            {isOpen && (
                <div className="position-absolute end-0 mt-5 me-1 bg rounded shadow-sm border z-3 p-2">
                    <div className="py-1">
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
                            onClick={handleDeletePost}
                            className="btn btn-outline-danger px-3 py-2 w-100 "
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

