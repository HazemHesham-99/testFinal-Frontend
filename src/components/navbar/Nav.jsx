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
    <Navbar expand="md" className="bg-body-tertiary" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to='/'>first site</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to='/'>Home</Nav.Link>
            {!isLoggedIn && <>     <Nav.Link as={Link} to='/register'>Register</Nav.Link>
              <Nav.Link as={Link} to='/login'>Login</Nav.Link></>}

            {isLoggedIn &&
              <>
                <Nav.Link as={Link} to='/profile'>Profile</Nav.Link>
                <Button variant='outline-danger' onClick={handleLogout}>Logout</Button>

              </>}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  )
}
