// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
                await register(formData.username, formData.email, formData.password);
                toast.success('Registration successful! Redirecting to login...', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => navigate('/login'), 1000); 
            } catch (err) {
                console.error('Registration error:', err);
                toast.error('Failed to register. Please try again.', {
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
                });
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-300 to-grey-500">
            <ToastContainer />
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-300">
                <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
                    Register
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                                errors.username ? 'border-red-500' : ''
                            }`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                                errors.email ? 'border-red-500' : ''
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
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                                errors.password ? 'border-red-500' : ''
                            }`}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                                errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-3 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-500 hover:text-green-600 transition duration-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
