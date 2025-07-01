import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { clearUserDetails } from '../../src/slices/userslices';
import { Link } from 'react-router-dom';
import logout from '/logout.png'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// Server URL
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${serverUrl}/logout`, {
                withCredentials: true,
            });
            if (response.data.message) {
                toast.success(response.data.message);
                setTimeout(() => {
                    localStorage.removeItem('isAuthenticated');
                    setIsAuthenticated(false);
                    dispatch(clearUserDetails());
                    navigate('/', { replace: true });
                    window.location.reload();
                }, 2000); // Wait for 2 seconds before reloading the page
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };

    return (
        <>
            <Navbar className='border navbar' expand="lg">
                <Container>
                    <img src="/Only_logo.png" className='logo w-15' alt="Logo" />
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto d-flex">
                            <Nav.Link
                                as={Link}
                                to="/app/invoices"
                                className={`poppins-bold nav-link-custom ${location.pathname === "/app/invoices" ? "active" : ""}`}
                            >
                                Invoices
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/app/customers"
                                className={`poppins-bold nav-link-custom ${location.pathname === "/app/customers" ? "active" : ""}`}
                            >
                                Customers
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/app/items"
                                className={`poppins-bold nav-link-custom ${location.pathname === "/app/items" ? "active" : ""}`}
                            >
                                Prodects/Services
                            </Nav.Link>
                            <button type="button" className="flex items-center justify-center w-30 border rounded bg-gray-500 text-white" onClick={handleLogout}><img className='w-3 h-3 mx-1 logoutImage' src={logout} alt="logout" />Logout</button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <ToastContainer />
        </>
    );
}
