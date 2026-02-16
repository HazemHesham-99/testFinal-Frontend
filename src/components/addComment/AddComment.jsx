
import React, { useState } from 'react'
import GeneralComment from '../generalComment/GeneralComment'
import { api } from '../../APIS/api';

export default function AddComment({ postId, setAddComment }) {
    const [commentText, setCommentText] = useState("")
    
    async function postComment(text) {
        // const data = commentText

        try {
            const response = await api.post(`/api/v1/comment/createComment/${postId}`, { text })
            setAddComment(response.data.comment)
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <GeneralComment commentText={commentText} handleSubmit={postComment} data={"comment"} setCommentText={setCommentText} />
    )
}
