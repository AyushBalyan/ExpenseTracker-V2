// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [formData, setFormData] = useState({
        userInput: '', // This will store either username or email
        password: ''
    });
    const [errors, setErrors] = useState({});
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.userInput.trim()) {
            newErrors.userInput = 'Username or Email is required';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await login(formData.userInput, formData.password);
                navigate('/dashboard');
            } catch (err) {
                console.error('Login error:', err);
                toast.error('Failed to log in. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } else {
            Object.values(errors).forEach((error) => {
                toast.error(error, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    transition:Bounce,
                });
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
            <ToastContainer />
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                    Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            name="userInput"
                            value={formData.userInput}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ${
                                errors.userInput ? 'border-red-500' : ''
                            }`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ${
                                errors.password ? 'border-red-500' : ''
                            }`}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-600 transition duration-300">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
