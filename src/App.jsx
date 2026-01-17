
import React, { useEffect } from 'react'
import NavBar from './components/navbar/Nav'
import { Container } from 'react-bootstrap'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import { Toaster } from 'react-hot-toast'
import Otpconfirm from './pages/otpconfirm/Otpconfirm'
import { api } from './APIS/api'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './store/slices/userSlice'

export default function App() {
  const {isLoggedIn} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    async function validateToken() {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await api.get("/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log(response.data)
          dispatch(setUser(response.data))
        }
      } catch (error) {
        console.log(error)
      }
    }
    validateToken()

  }, [])
  return (

    < div >
      <Toaster />
      <NavBar />
      <Container className='my-3 py-3'>
        <Routes>
          {(!isLoggedIn) && (<><Route Component={Login} path='/login' />
            <Route Component={Register} path='/register' />
            <Route Component={Otpconfirm} path='/verify-otp' /></>)}

        </Routes>
      </Container>
    </div >
  )
}
