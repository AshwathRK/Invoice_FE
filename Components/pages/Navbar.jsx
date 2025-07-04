import React, { useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import logout from '/logout.png';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearUserDetails } from '../../src/slices/userslices';

// Server URL
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function NavbarComponent() {
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
                }, 2000);
            }
        } catch (error) {
            // console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };

    return (
        <>
            <nav className="bg-gray-100 border-b border-gray-200 py-4 navbar">
                <div className="container mx-auto flex justify-between items-center">
                    <img src="/Only_logo.png" className="w-15 h-10" alt="Logo" />
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink
                            to="/app/invoices"
                            className={({ isActive }) =>
                                `font-medium text-black transition duration-300 ${
                                    isActive
                                        ? 'border-b-2 border-black'
                                        : 'hover:border-b-2 hover:border-black'
                                }`
                            }
                        >
                            Invoices
                        </NavLink>
                        <NavLink
                            to="/app/customers"
                            className={({ isActive }) =>
                                `font-medium text-black transition duration-300 ${
                                    isActive
                                        ? 'border-b-2 border-black'
                                        : 'hover:border-b-2 hover:border-black'
                                }`
                            }
                        >
                            Customers
                        </NavLink>
                        <NavLink
                            to="/app/items"
                            className={({ isActive }) =>
                                `font-medium text-black transition duration-300 ${
                                    isActive
                                        ? 'border-b-2 border-black'
                                        : 'hover:border-b-2 hover:border-black'
                                }`
                            }
                        >
                            Products/Services
                        </NavLink>
                        <button
                            type="button"
                            className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleLogout}
                        >
                            <img
                                className="w-4 h-4 mr-2 filter invert"
                                src={logout}
                                alt="logout"
                            />
                            Logout
                        </button>
                    </div>
                    <button className="md:hidden flex justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>
            </nav>
            <ToastContainer />
        </>
    );
}
