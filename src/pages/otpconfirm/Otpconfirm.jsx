import React, { useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { api } from '../../APIS/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/loading/Loading'

export default function Otpconfirm() {
    const otpref = useRef()
    const go = useNavigate()
    const [loading, setloading] = useState(false)

    async function handleOtp(ev) {
        ev.preventDefault()
        setloading(true)
        try {
            const email = localStorage.getItem("email")
            if (!email) {
                toast.error("invalid OTP or expired")
                go("/login")
            }
            const data = { otp: otpref.current.value, email: email }
            const response = await api.post("/api/v1/auth/verify-otp", data)
            console.log(response)
            localStorage.setItem("token",response.data.token)
            toast.success(response.data.message)
            go("/")

        } catch (err) {
            toast.error(err.response.data.message)

        } finally {
            setloading(false)
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <Form onSubmit={handleOtp}>
                <Form.Group className='mb-4'>
                    <Form.Label className='mb-3'>ENTER OTP</Form.Label>
                    <Form.Control type='text' id='otp' name='otp' placeholder='enter the OTP' ref={otpref} maxLength={6} minLength={6} />
                </Form.Group>

                <Button type='submit'>Register</Button>

            </Form>

        </div>
    )
}
