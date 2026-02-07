
import React, { useEffect, useState } from 'react'
import "./App.css"
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
import AddComment from './components/addComment/AddComment'

export default function App() {
  const { isLoggedIn } = useSelector((state) => state.user)
  const dispatch = useDispatch()


  const [theme, setTheme] = useState('light');
    useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };




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

    <div className="d-flex flex-column min-vh-100">
      <Toaster />
      <NavBar />

      {/* light and dark mood */}
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>



      <div className="flex-grow-1">

        <Container className='my-3 py-3'>
          <Routes>
            {(isLoggedIn) && (<>
              <Route Component={Profile} path='/profile' />
              <Route Component={AddComment} path='/test' />

            </>)}
            <Route Component={Home} path='/' />

            {(!isLoggedIn) && (<>
              <Route Component={Login} path='/login' />
              <Route Component={Register} path='/register' />
              <Route Component={Otpconfirm} path='/verify-otp' />
              <Route Component={Restpassword} path='/reset-password/:token' />
            </>)}

          </Routes>
        </Container>
      </div >
    </div >
  )
}
