import React, { useRef, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { data } from 'react-router-dom'
import { api } from '../../APIS/api'

export default function GeneralComment({commentText, handleSubmit , setCommentText}) {

    // const [inputText, setinputText] = useState("")
    function handlechange(e) {
        setCommentText(e.target.value)
    }
    function handle(){
        handleSubmit(commentText)
        setCommentText("")
    }
    return (
        <Form>
            <Form.Group className='mb-4'>
                <InputGroup className='align-items-center gap-2' >
                    <Form.Control className='rounded-2' onChange={handlechange} type="text"  placeholder='Add a comment' value={commentText} />
                    <Button className='rounded-1' disabled={!commentText.trim()} onClick={handle}>Post</Button>
                </InputGroup>
            </Form.Group>

        </Form>

    )
}
