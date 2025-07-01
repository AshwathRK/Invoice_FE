import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmpassword: '',
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = ['fullname', 'email', 'password', 'confirmpassword'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field} is required`);
                return;
            }
        }

        if (formData.password !== formData.confirmpassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${serverUrl}/signup`,
                formData,
                { withCredentials: true }
            );

            // console.log(serverUrl)
            toast.success("Account created successfully. Please log in.");

            setTimeout(function () {
                navigate('/');
            }, 3000);
            setFormData({
                fullname: '',
                email: '',
                password: '',
                confirmpassword: '',
            });
        } catch (error) {
            if (error.response) {
                const msg = error.response.data.message || "Sign-up failed";
                toast.error(msg);
            } else {
                toast.error("Network error or server unavailable");
            }
        }
    };

    return (
        <div className="SignupPage min-h-screen flex justify-center items-center bg-gray-100">
            <div className="signup-container h-200 flex bg-white shadow-lg overflow-hidden w-[90%] max-w-9xl">
                {/* Illustration Area */}
                <div className="illustration-area bg-gray-50 flex justify-center items-center p-6">
                    <img
                        src="./bg-login.png"
                        className="w-full max-w-3xl loginImage"
                        alt="Illustration of person signing up"
                    />
                </div>

                {/* Form Area */}
                <div className="form-area flex justify-center items-center p-8">
                    <div className="w-full max-w-md space-y-6">
                        <h2 className="text-3xl font-bold text-center text-gray-800">Sign Up</h2>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullname" className="block text-sm poppins-regular font-medium text-gray-700 mb-1">
                                    Full Name:
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Full Name"
                                    autoComplete="name"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="block text-sm poppins-regular font-medium text-gray-700 mb-1">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
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
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    onPaste={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                    onChange={handleChange}
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

                            <div className="form-group relative">
                                <label htmlFor="confirmPassword" className="block text-sm poppins-regular font-medium text-gray-700 mb-1">
                                    Confirm Password:
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    placeholder="Confirm Password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    onPaste={(e) => e.preventDefault()}
                                    onCopy={(e) => e.preventDefault()}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
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

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition poppins-regular"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="text-center flex text-sm text-gray-600 poppins-regular">
                            Already have an account?{' '}
                            <Link to={"/login"} className="text-blue-600 px-2 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}