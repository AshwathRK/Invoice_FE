import axios from 'axios';
import { useDispatch } from 'react-redux';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { AppContext } from '../src/App';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Login() {
    const { setIsAuthenticated } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                serverUrl,
                { email, password },
                { withCredentials: true }
            );

            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            dispatch(addUserDetails(response.data.user));
            toast.success("Login successful!");
            navigate('/user');
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Network error");
            }
        }

        setEmail('');
        setPassword('');
    };

    return (
        <div className="LoginPage min-h-screen flex justify-center items-center bg-gray-100">
            <div className="signup-container h-200  flex bg-white shadow-lg overflow-hidden w-[90%] max-w-9xl">
                {/* Illustration Area */}
                <div className="illustration-area bg-gray-50 flex justify-center items-center p-6">
                    <img
                        src="./bg-login.png"
                        className="w-full max-w-3xl"
                        alt="Illustration of person using laptop"
                    />
                </div>

                {/* Form Area */}
                <div className="form-area flex justify-center items-center p-8">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-3xl font-bold text-center text-gray-800">Sign In</h2>
                        <form className="space-y-5" onSubmit={handleSubmit} >
                            <div className="form-group">
                                <label htmlFor="useremail" className="block text-sm poppins-regular font-medium text-gray-700 mb-1">
                                    Your email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Your email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="form-group relative">
                                <label htmlFor="password" className="block text-sm poppins-regular font-medium text-gray-700 mb-1">
                                    Password:
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onPaste={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.78zm6.261 6.261l1.473 1.473a5.011 5.011 0 01-1.48 1.478l-1.473-1.473a3 3 0 004.243-4.243zm6.267 4.243l1.473 1.473a9.957 9.957 0 01-3.968 1.52l-1.473-1.473a5 5 0 007.12-7.12l-1.473 1.473a3 3 0 01-4.243 4.243z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="form-group flex items-center">
                                <input type="checkbox" id="remember-me" name="remember-me" className="" />
                                <label htmlFor="remember-me" className="text-sm text-gray-700 poppins-regular px-2">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition poppins-regular"
                            >
                                Log in
                            </button>
                        </form>

                        <p className="text-center flex text-sm text-gray-600 poppins-regular">
                            Don't have an account?{' '}
                            <Link to={"/signup"} className="text-blue-600 px-2 hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}