import React, { useRef, useState } from 'react'
import { Button, Form, FormGroup, FormLabel, InputGroup } from 'react-bootstrap'
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { api } from '../../APIS/api';
import toast from 'react-hot-toast';
import Loading from '../../components/loading/Loading';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [togglePassword, settogglePassword] = useState(false)
    const [loading, setloading] = useState(false)
    const emailref = useRef()
    const passwordref = useRef()
    const nameref = useRef()
    const go = useNavigate()

    async function handleRegister(ev) {
        ev.preventDefault()
        setloading(true)
        try {
            const data = {
                email: emailref.current.value,
                password: passwordref.current.value,
                name: nameref.current.value,
            }

            const response = await api.post("/api/v1/auth/register", data)

            toast.success(response.data.message)
            localStorage.setItem("email", data.email)
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
        <div className='d-flex justify-content-center align-items-center min-vh-80 pt-5'>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-12 col-md-8 col-lg-6'>
                        {/* LOGO */}
                        <div className='text-center mb-5'>
                            <div className='d-flex align-items-center justify-content-center '>
                                <h1 class="display-1 fw-bolder text-primary">ZBOOK</h1>
                            </div>
                            <p >Join thousands of users worldwide</p>
                        </div>

                        {/* Registration form */}
                        <Form className="shadow-lg p-4 rounded-4" onSubmit={handleRegister}>
                            <h3 className='text-center'>Create New Account</h3>
                            <hr />
                            {/* E-mail */}
                            <Form.Group className='mb-4 mt-4'>
                                <Form.Label className='mb-3'>E-mail</Form.Label>
                                <Form.Control type='email' id='email' name='email' placeholder='enter your email' ref={emailref} />
                            </Form.Group>

                            {/* Username */}
                            <Form.Group className='mb-4'>
                                <Form.Label className='mb-3'>Name</Form.Label>
                                <Form.Control type='text' id='name' name='name' placeholder='enter your Name' ref={nameref} />
                            </Form.Group>

                            {/* password */}
                            <Form.Group className='mb-4'>
                                <Form.Label className='mb-3'>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control type={togglePassword ? 'password' : 'text'} id='password' name='password' placeholder='enter your password' ref={passwordref} />
                                    <InputGroup.Text style={{ cursor: 'pointer' }} onClick={controlPassword}>
                                        {togglePassword ?  <FaEyeSlash /> : <FaRegEye />}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            {/* submit Button */}
                            <div className='d-flex justify-content-center'>
                                <Button variant="primary" size="lg" className="px-5" type='submit'>Register</Button>

                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
