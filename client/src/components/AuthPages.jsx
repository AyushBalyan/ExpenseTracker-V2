import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPages = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    loginUsername: '',
    loginPassword: '',
    registerUsername: '',
    registerEmail: '',
    registerPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!formData.loginUsername || !formData.loginPassword) {
      toast.error('Username and password are required');
      return;
    }
    
    try {
      setIsLoading(true);
      await login(formData.loginUsername, formData.loginPassword);
      toast.success('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.registerUsername || !formData.registerEmail || !formData.registerPassword) {
      toast.error('All fields are required');
      return;
    }
    
    try {
      setIsLoading(true);
      await register(formData.registerUsername, formData.registerEmail, formData.registerPassword);
      toast.success('Registration successful! You can now login.');
      
      // Reset register form
      setFormData({
        ...formData,
        registerUsername: '',
        registerEmail: '',
        registerPassword: ''
      });
      
      // Switch to login form after successful registration
      setTimeout(() => setIsActive(false), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-sky-200 font-[Poppins] p-4">
      <div className={`relative w-full max-w-[850px] h-[600px] bg-white rounded-[30px] shadow-[0_15px_50px_rgba(0,0,0,0.1)] overflow-hidden
        ${isActive ? 'active' : ''}`}>
        <ToastContainer />
        
        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full p-[40px] transition-all duration-700 ease-in-out transform 
          ${isActive ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-sky-700 mb-6">Sign In</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  name="loginUsername" 
                  required
                  value={formData.loginUsername}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-blue-50 border-none outline-none rounded-md px-4 text-base transition-all duration-300 focus:border-b-2 focus:border-sky-400"
                  placeholder="Username or Email"
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  name="loginPassword" 
                  required
                  value={formData.loginPassword}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-blue-50 border-none outline-none rounded-md px-4 text-base transition-all duration-300 focus:border-b-2 focus:border-sky-400"
                  placeholder="Password"
                />
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-blue-400 hover:text-sky-600 transition-colors">Forgot Password?</a>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-md text-base font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:from-sky-500 hover:to-blue-600 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Sign Up Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full p-[40px] transition-all duration-700 ease-in-out transform
          ${isActive ? 'translate-x-[100%] opacity-100' : 'translate-x-[100%] opacity-0'}`}>
          <div className="h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-sky-700 mb-6">Create Account</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  name="registerUsername" 
                  required
                  value={formData.registerUsername}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-blue-50 border-none outline-none rounded-md px-4 text-base transition-all duration-300 focus:border-b-2 focus:border-sky-400"
                  placeholder="Username"
                />
              </div>
              <div className="relative">
                <input 
                  type="email" 
                  name="registerEmail" 
                  required
                  value={formData.registerEmail}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-blue-50 border-none outline-none rounded-md px-4 text-base transition-all duration-300 focus:border-b-2 focus:border-sky-400"
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  name="registerPassword" 
                  required
                  value={formData.registerPassword}
                  onChange={handleInputChange}
                  className="w-full h-12 bg-blue-50 border-none outline-none rounded-md px-4 text-base transition-all duration-300 focus:border-b-2 focus:border-sky-400"
                  placeholder="Password"
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-md text-base font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:from-sky-500 hover:to-blue-600 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Overlay */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20
          ${isActive ? 'translate-x-[-100%]' : 'translate-x-0'}`}>
          <div className={`bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 text-white absolute top-0 -left-[100%] h-full w-[200%] transform transition-transform duration-700 ease-in-out
            ${isActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Left Panel - Sign Up info (visible when on Login page) */}
            <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center px-[40px] text-center transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <h2 className="text-4xl font-bold mb-3 text-white">Hello, Friend!</h2>
              <p className="text-base mb-[30px] text-white">
                Enter your personal details and start the journey with us
              </p>
              <button 
                onClick={() => setIsActive(true)}
                className="h-10 px-6 border border-white rounded-full bg-transparent text-white text-sm uppercase font-semibold tracking-wider transition-colors duration-300 hover:bg-white hover:text-sky-500"
              >
                Sign Up
              </button>
            </div>
            
            {/* Right Panel - Login info (visible when on Sign Up page) */}
            <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center px-[40px] text-center transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h2 className="text-4xl font-bold mb-3 text-white">Welcome Back!</h2>
              <p className="text-base mb-[30px] text-white">
                To keep connected with us please login with your personal info
              </p>
              <button 
                onClick={() => setIsActive(false)}
                className="h-10 px-6 border border-white rounded-full bg-transparent text-white text-sm uppercase font-semibold tracking-wider transition-colors duration-300 hover:bg-white hover:text-sky-500"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .active {
            height: 850px !important;
          }
          
          .active > div:first-child {
            transform: translateY(-100%);
            opacity: 0;
          }
          
          .active > div:nth-child(2) {
            transform: translateY(-100%);
            opacity: 1;
          }
          
          .active > div:nth-child(3) {
            height: 100% !important;
            transform: translateY(100%) !important;
          }
          
          .active > div:nth-child(3) > div {
            transform: translateY(-50%) !important;
          }
          
          div:first-child, div:nth-child(2) {
            width: 100% !important;
            transition: 0.7s ease-in-out;
            transition-delay: calc(0.7s * 0.8);
          }
          
          div:nth-child(3) {
            left: 0 !important;
            width: 100% !important;
            transition: 0.7s ease-in-out;
            z-index: 100;
            transition-delay: calc(0.7s * 0.7);
          }
          
          div:nth-child(3) > div {
            left: 0 !important;
            width: 100% !important;
            transition: 0.7s ease-in-out;
            transition-delay: calc(0.7s * 0.6);
          }
          
          div:nth-child(3) > div > div {
            width: 100% !important;
            transition: 0.7s ease-in-out !important;
            transition-delay: calc(0.7s * 0.5) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPages;