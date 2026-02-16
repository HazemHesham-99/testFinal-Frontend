import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import AddComment from '../addComment/AddComment'
import { api } from '../../APIS/api'
import CommentCard from '../commentCard/CommentCard'
import Loading from '../loading/Loading'

export default function CommentPage({ post, show, onClose }) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
   
    const [deletedComment, setDeletedComment] = useState("")
    if (deletedComment) {
        console.log(deletedComment)
        setComments(comments.filter((comment) => comment._id != deletedComment))
        setDeletedComment("")
    }

    // to appear updated comment
    const [updateComment, setUpdateComment] = useState("")
    if (updateComment) {
        console.log(updateComment)
        setComments(comments.filter((comment) => comment._id != deletedComment))
        setUpdateComment("")
    }


    // to appear new comment 
    const [addComment, setAddComment] = useState({})
    if (addComment._id) {
        setComments([addComment, ...comments])
        setAddComment({})
    }


    async function fetchAllcomments() {
        setLoading(true)
        try {
            const id = post._id.toString()
            const response = await api.get(`/api/v1/posts/${id}/comment`)
            console.log(response.data.comments)
            setComments(response.data.comments)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        if (show) {
            fetchAllcomments()

        }
    }, [show])


    return (
        <div>
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={onClose}

            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Comments
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <Loading />}
                    {!loading && (

                        comments.map(comment => (
                            <CommentCard key={comment._id} comment={comment} setDeletedComment={setDeletedComment} />
                        ))

                    )}

                </Modal.Body>
                <Modal.Footer className='w-100 p-0'>
                    <div className="w-100 p-1 mt-3">
                        <AddComment postId={post?._id}
                            setAddComment={setAddComment}
                        />

                    </div>
                </Modal.Footer>

            </Modal></div>
    )
}
