
import React, { useEffect, useState } from 'react'
import "./App.css"
import NavBar from './components/navbar/Nav'
import { Button, Container } from 'react-bootstrap'
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
import Messages from './pages/Messages/Messages'
//========ADD=========
import { setupNotificationListeners } from "./socket/notificationListeners"
import { connectSocket , disconnectSocket } from './socket/Socket'
import { SocketContext } from './store/context/socketContext'
//=====================
export default function App() {

  //======================
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  //============================
  const { isLoggedIn } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  // dark / light mood
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme)

  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  //check if sign in or not
  const token = localStorage.getItem("token")

//====================================
useEffect(() => {

  if (!token) return

  const s = connectSocket(token)
  setSocket(s)

  setupNotificationListeners(s, {
    onNewNotification: (notif) => {
      setNotifications(prev => [notif, ...prev])
      setUnreadCount(prev => prev + 1)
    },

    onNotificationList: (list) => {
      setNotifications(list)
      setUnreadCount(list.filter(n => !n.read).length)
    }
  })

  return () => {
    disconnectSocket()
  }

}, [token])
//======================================
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
<SocketContext.Provider value={socket}>

    <div className="d-flex flex-column min-vh-100">
      <Toaster />
      <NavBar />

      {/* light and dark mood */}
      <Button className='displayMoodButton' variant="outline-primary" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </Button>



      <div className="flex-grow-1">

        <Container className='my-3 py-3'>
          <Routes>
            {(isLoggedIn) && (<>
              <Route Component={Profile} path='/profile' />
              <Route Component={AddComment} path='/test' />

            </>)}
            <Route Component={Home} path='/' />
            <Route Component={Messages} path='/messages' />

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
    </SocketContext.Provider>

  )
}
