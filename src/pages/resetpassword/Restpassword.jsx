import React, { useRef, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../APIS/api'
import toast from 'react-hot-toast'
import Loading from '../../components/loading/Loading'

export default function Restpassword() {
    const [loading, setloading] = useState(false)

    const [togglePassword, settogglePassword] = useState(false)
    const passwordref = useRef()
    const { token } = useParams()
    const go = useNavigate()
    function controlPassword() {
        settogglePassword((prev) => !prev)
    }

    async function handleResetPassword(ev) {
        ev.preventDefault()
        const data = { passwordToken: token, newPassword: passwordref.current.value }
        try {
            setloading(true)
            const response = await api.post("/api/v1/auth/reset-password", data)
            console.log(response)
            toast.success(response.data.message)
            go("/login")
        } catch (error) {
            console.log(error.response.data)
            if (error.response?.data?.message) {
                if (Array.isArray(error.response?.data?.message)) {
                    error.response.data.message.forEach((message) => {
                        toast.error(message)
                    });
                } else {
                    toast.error(error.response.data.message)

                }

            } else {
                toast.error("something wrong")
            }
        } finally {
            setloading(false)
        }

    }

    if (loading) {
        return <Loading />
    }
    return (
        <Form onSubmit={handleResetPassword}>
            <Form.Group className='mb-4'>
                <Form.Label className='mb-3'>New Password</Form.Label>
                <InputGroup>
                    <Form.Control type={togglePassword ? 'password' : 'text'} id='password' name='password' placeholder='enter your password' ref={passwordref} />
                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={controlPassword}>
                        {togglePassword ? <FaRegEye /> : <FaEyeSlash />}
                    </InputGroup.Text>
                </InputGroup>
            </Form.Group>
            <Button type='submit'>Reset</Button>

        </Form>

    )
}
