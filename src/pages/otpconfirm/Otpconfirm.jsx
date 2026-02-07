import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { api } from '../../APIS/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/loading/Loading'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/slices/userSlice'

function useTimer(initialTime) {

    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        if (time <= 0) {
            return;
        }

        const timer = setInterval(() => setTime(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [time]);
    return { time, setTime };

}

export default function Otpconfirm() {
    const otpref = useRef()
    const go = useNavigate()
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)
    const [butloading, setbutloading] = useState(false)
    const { time, setTime } = useTimer(60)


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
            localStorage.setItem("token", response.data.token)
            dispatch(setUser(response.data.user))
            toast.success(response.data.message)
            go("/")

        } catch (err) {
            toast.error(err.response.data.message)

        } finally {
            setloading(false)
        }
    }

    async function controlResendOTP() {
        setbutloading(true)
        try {
            const response = await api.post("/api/v1/auth/resend-otp", { email: localStorage.getItem("email") })
            console.log(response)
            setTime(60)
            toast.success(response.data.message)

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)

        } finally {
            setbutloading(false)
        }
    }




    if (loading) {
        return <Loading />
    }

    return (
        <div className='d-flex justify-content-center align-items-center min-vh-50 pt-5'>
            <Form className="shadow-lg p-4 rounded-4" onSubmit={handleOtp}>
                <Form.Group className='mb-4'>
                    <Form.Label className='mb-3 text-center fw-bold d-block fs-5'>ENTER OTP</Form.Label>
                    <InputGroup>
                        <Form.Control type='text' id='otp' name='otp' placeholder='enter the OTP' ref={otpref} maxLength={6} minLength={6} />
                        {time ? <InputGroup.Text>{time}</InputGroup.Text> : <Button variant='outline-secondary' style={{ cursor: 'pointer' }} onClick={controlResendOTP}>
                            {butloading ? <Loading size='sm' /> : "Resend OTP"}
                        </Button>}
                    </InputGroup>
                </Form.Group>


                <div className='d-flex justify-content-center'>
                    <Button type='submit'>Confirm OTP</Button>
                </div>

            </Form>

        </div>
    )
}
