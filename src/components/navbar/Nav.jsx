import React from 'react'
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearUser } from '../../store/slices/userSlice';


export default function NavBar() {
  const { isLoggedIn } = useSelector((state) => state.user)
  const go = useNavigate()
  const dispatch = useDispatch()
  function handleLogout() {
    dispatch(clearUser())
    go("/login")
  }
  return (
    <Navbar expand="md" className="bg-primary navbar-dark rounded-2 "   >
      <Container>
        <Navbar.Brand className='text-light display-1 fw-bolder' as={Link} to='/'>ZBOOK</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-white" />

        <Navbar.Collapse className="text-white " id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link className="text-white" as={Link} to='/'>Home</Nav.Link>
            {!isLoggedIn && <>     <Nav.Link className="text-white" as={Link} to='/register'>Register</Nav.Link>
              <Nav.Link className="text-white" as={Link} to='/login'>Login</Nav.Link></>}

            {isLoggedIn &&
              <>
                <Nav.Link as={Link} className="text-white" to='/profile'>Profile</Nav.Link>
                <Nav.Link as={Link} className="text-white" to='/messages'>Chats</Nav.Link>

                <Button variant='danger' onClick={handleLogout}>Logout</Button>


              </>}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  )
}
