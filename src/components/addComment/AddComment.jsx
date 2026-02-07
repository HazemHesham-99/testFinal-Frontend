// import React, { useRef, useState } from 'react'
// import { Button, Form, InputGroup } from 'react-bootstrap'
// import { data } from 'react-router-dom'
// import { api } from '../../APIS/api'

// export default function AddComment({ postId ,setAddComment }) {

//     const [inputText, setinputText] = useState("")
//     async function postComment(e) {
//         e.preventDefault();
//         const data = inputText
//         const token = localStorage.getItem("token")

//         try {
//             const response = await api.post(`/api/v1/comment/createComment/${postId}`, { text: data }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             })

//             console.log(response)
//             setAddComment(response.data.comment)
//             setinputText("")
//         } catch (error) {
//             console.log(error)
//         }

//     }
//     function handlechange(e) {
//         setinputText(e.target.value)
//     }
//     return (
//         <Form>
//             <Form.Group className='mb-4'>
//                 <InputGroup>
//                     <Form.Control onChange={handlechange} type='text' id='comment' name='comment' placeholder='Add a comment' value={inputText} />
//                     <Button disabled={!inputText.trim()} onClick={postComment}>Post</Button>
//                 </InputGroup>
//             </Form.Group>

//         </Form>

//     )
// }

import React, { useState } from 'react'
import GeneralComment from '../generalComment/GeneralComment'
import { api } from '../../APIS/api';

export default function AddComment({ postId, setAddComment }) {
    const [commentText, setCommentText] = useState("")
    
    async function postComment(text) {
        // const data = commentText
        const token = localStorage.getItem("token")

        try {
            const response = await api.post(`/api/v1/comment/createComment/${postId}`, { text }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log(response)
            setAddComment(response.data.comment)
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <GeneralComment commentText={commentText} handleSubmit={postComment} data={"comment"} setCommentText={setCommentText} />
    )
}
