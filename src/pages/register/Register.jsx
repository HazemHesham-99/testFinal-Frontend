import React, { useRef, useState } from 'react'
import { Button, Form, FormGroup, FormLabel, InputGroup } from 'react-bootstrap'
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { api } from '../../APIS/api';
import toast from 'react-hot-toast';
import Loading from '../../components/loading/Loading';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [togglePassword, settogglePassword] = useState("false")
    const [loading, setloading] = useState(false)
    const emailref = useRef()
    const passwordref = useRef()
    const go = useNavigate()

    async function handleRegister(ev) {
        ev.preventDefault()
        setloading("true")
        try {
            const data = {
                email: emailref.current.value,
                password: passwordref.current.value
            }

            const response = await api.post("/api/v1/auth/register", data)

            toast.success(response.data.message)
            localStorage.setItem("email",data.email)
            go("/verify-otp")

        } catch (error) {
            console.log(error)
            if (error.response?.data?.message) {
                error.response.data.message.forEach((message) => {
                    toast.error(message)
                });
            }
            else {
                toast.error("something wrong")
            }

        } finally {
            setloading(false)

        }

    }

    function controlPassword() {
        settogglePassword((prev) => !prev)
    }

    if (loading) {
       return <Loading />
    }

    return (
        <div>
            <Form onSubmit={handleRegister}>
                <Form.Group className='mb-4'>
                    <Form.Label className='mb-3'>E-mail</Form.Label>
                    <Form.Control type='email' id='email' name='email' placeholder='enter your email' ref={emailref} />
                </Form.Group>

                <Form.Group className='mb-4'>
                    <Form.Label className='mb-3'>Password</Form.Label>
                    <InputGroup>
                        <Form.Control type={togglePassword ? 'password' : 'text'} id='password' name='password' placeholder='enter your password' ref={passwordref} />
                        <InputGroup.Text style={{ cursor: 'pointer' }} onClick={controlPassword}>
                            {togglePassword ? <FaRegEye /> : <FaEyeSlash />}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                <Button type='submit'>Register</Button>
            </Form>
        </div>
    )
}
