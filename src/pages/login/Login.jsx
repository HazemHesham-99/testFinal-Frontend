import React, { useRef, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import Loading from '../../components/loading/Loading'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../../APIS/api'

export default function Login() {
  const [togglePassword, settogglePassword] = useState(false)
  const [loading, setloading] = useState(false)
  const emailref = useRef()
  const passwordref = useRef()

  const go = useNavigate()


  async function handleSignin(ev) {

    ev.preventDefault()
    setloading("true")
    const data = {
      email: emailref.current.value,
      password: passwordref.current.value
    }
    try {


      const response = await api.post("/api/v1/auth/login", data)

      toast.success(response.data.message)
      localStorage.setItem("email", data.email)
      localStorage.setItem("token", response.data.token)
      console.log(response.data.token)
      go("/")

    } catch (error) {
      console.log(error)

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

      if (error.response?.data?.verify == false) {
        localStorage.setItem("email", error.response.data.email)
        go("/verify-otp")

      }

    } finally {
      setloading(false)

    }

  }

  function controlPassword() {
    settogglePassword((prev) => !prev)
  }

  async function handleForgetPassword() {

    try {
      const response = await api.post("/api/v1/auth/forget-password", { email: emailref.current.value })

      toast.success(response.data.message)
      emailref.current.value =""
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
    }

  }

  if (loading) {
    return <Loading />
  }
  return (
    <div>
      <h1>Login</h1>
      <Form onSubmit={handleSignin}>
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


        <Button type='submit'>sign in</Button>
      </Form>
      <p style={{ cursor: 'pointer' }} onClick={handleForgetPassword}> forget password</p>
    </div>)
}
