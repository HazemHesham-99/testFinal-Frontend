import React, { useRef, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import Loading from '../../components/loading/Loading'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../../APIS/api'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/slices/userSlice'

export default function Login() {
  const [togglePassword, settogglePassword] = useState(false)
  const [loading, setloading] = useState(false)
  const emailref = useRef()
  const passwordref = useRef()
  const dispatch = useDispatch()

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
      dispatch(setUser(response.data.user))

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
      emailref.current.value = ""
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
    <div className='d-flex justify-content-center align-items-center pt-5'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-8 col-lg-6'>
            <Form className="shadow-lg p-4 rounded-4" onSubmit={handleSignin}>
              <h3 className='text-center'>LOGIN</h3>
              <hr />
              <Form.Group className='mb-4'>
                <Form.Label className='mb-3'>E-mail</Form.Label>
                <Form.Control type='email' id='email' name='email' placeholder='enter your email' ref={emailref} />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label className='mb-3'>Password</Form.Label>
                <InputGroup>
                  <Form.Control type={togglePassword ? 'password' : 'text'} id='password' name='password' placeholder='enter your password' ref={passwordref} />
                  <InputGroup.Text style={{ cursor: 'pointer' }} onClick={controlPassword}>
                    {togglePassword ? <FaEyeSlash /> : <FaRegEye />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              <div className='d-flex justify-content-center'>
                <Button variant="primary" size="lg" className="px-5" type='submit'>sign in</Button>
              </div>

            </Form>
            <div className='d-flex justify-content-between mt-4'>
              <span
                className="text-decoration-underline text-primary mt-5 fs-5"
                style={{ cursor: 'pointer' }}
                onClick={handleForgetPassword}
                onMouseEnter={(e) => e.target.classList.replace('text-primary', 'text-primary-emphasis')}
                onMouseLeave={(e) => e.target.classList.replace('text-primary-emphasis', 'text-primary')}
              >
                Forgot password?
              </span>
              <span
                className="text-decoration-underline text-primary mt-5 fs-5 "
                style={{ cursor: 'pointer' }}
                onClick={()=>{go("/register")}}
                onMouseEnter={(e) => e.target.classList.replace('text-primary', 'text-primary-emphasis')}
                onMouseLeave={(e) => e.target.classList.replace('text-primary-emphasis', 'text-primary')}
              >
                Create new account
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
