
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
import Restpassword from './pages/resetpassword/Restpassword'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'

export default function App() {
  const { isLoggedIn } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const token = localStorage.getItem("token")

  useEffect(() => {
    async function validateToken() {
      if (token) {
        try {
          const response = await api.get("/api/v1/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          })
          dispatch(setUser(response.data))
        }
        catch (error) {
          console.log(error)
          localStorage.removeItem("token")
        }
      }

    }
    validateToken()

  }, [token])
  return (

    < div >
      <Toaster />
      <NavBar />
      <Container className='my-3 py-3'>
        <Routes>
          {(isLoggedIn) && (<>
            <Route Component={Home} path='/' />
            <Route Component={Profile} path='/profile' />

          </>)}

          {(!isLoggedIn) && (<>
            <Route Component={Login} path='/login' />
            <Route Component={Register} path='/register' />
            <Route Component={Otpconfirm} path='/verify-otp' />
            <Route Component={Restpassword} path='/reset-password/:token' />
          </>)}

        </Routes>
      </Container>
    </div >
  )
}
