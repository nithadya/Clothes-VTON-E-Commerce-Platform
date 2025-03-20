import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShopContext } from '@/context/ShopContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced toast configurations
  const toastConfig = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    closeButton: false,
    className: "custom-toast-container",
    bodyClassName: "custom-toast-body",
    icon: false,
  };

  // Configure toast styles on component mount
  useEffect(() => {
    // Add custom toast CSS
    const style = document.createElement('style');
    style.textContent = `
      .custom-toast-container {
        border-radius: 8px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        padding: 0;
        min-width: 320px;
        background: white;
        border-left: 4px solid #7c3aed;
      }
      .custom-toast-body {
        padding: 0;
        margin: 0;
      }
      .Toastify__progress-bar {
        background: linear-gradient(to right, #9f7aea, #7c3aed);
        height: 3px;
      }
      .toast-action-button {
        transition: all 0.2s ease;
      }
      .toast-action-button:hover {
        transform: translateY(-1px);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Utility function to show different types of toasts
  const showToast = (type, message, title = null, actions = null) => {
    const icons = {
      success: (
        <div className="bg-green-500 rounded-full p-2 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ),
      error: (
        <div className="bg-red-500 rounded-full p-2 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ),
      info: (
        <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ),
      warning: (
        <div className="bg-yellow-500 rounded-full p-2 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V12M12 16H12.01M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )
    };

    const borderColors = {
      success: 'border-green-500',
      error: 'border-red-500',
      info: 'border-blue-500',
      warning: 'border-yellow-500',
    };

    const toastContent = (
      <div className="p-4">
        <div className="flex items-start">
          <div className="mr-3 flex-shrink-0">
            {icons[type]}
          </div>
          <div className="flex-1">
            {title && <h3 className="font-medium text-gray-900">{title}</h3>}
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        {actions && (
          <div className="flex justify-end space-x-3 mt-4">
            {actions}
          </div>
        )}
      </div>
    );

    toast(toastContent, {
      ...toastConfig,
      autoClose: actions ? false : 4000,
      closeOnClick: !actions,
      className: `custom-toast-container ${borderColors[type]}`,
    });
  };

  // Show loading toast
  const showLoadingToast = (message = "Processing your request...") => {
    return toast(
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-blue-500 rounded-full p-2 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-gray-800">{message}</p>
          </div>
        </div>
      </div>,
      {
        ...toastConfig,
        autoClose: false,
        closeOnClick: false,
        className: "custom-toast-container border-blue-500",
      }
    );
  };

  // Show reset password toast
  const showResetPasswordToast = () => {
    toast(
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-purple-600 rounded-full p-2 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Reset Password</h3>
            <p className="text-sm text-gray-600 mt-1">Enter your email address and we'll send you a link to reset your password.</p>
          </div>
        </div>
        
        <div className="mt-4">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Email address"
            autoFocus
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors toast-action-button"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss();
              showToast('success', 'Password reset link sent! Check your email inbox.', 'Email Sent');
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors toast-action-button"
          >
            Send Reset Link
          </button>
        </div>
      </div>,
      {
        ...toastConfig,
        autoClose: false,
        closeOnClick: false,
        className: "custom-toast-container border-purple-600",
      }
    );
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Show loading toast
    const loadingToastId = showLoadingToast(
      currentState === 'Login' ? 'Signing you in...' : 'Creating your account...'
    );
    
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          
          showToast(
            'success',
            'Your account has been successfully created!',
            'Welcome to our store!'
          );
          
          // Navigate to home page after successful registration
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          showToast('error', response.data.message, 'Registration Failed');
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          
          showToast(
            'success',
            'You have successfully logged in!',
            'Welcome back!'
          );
          
          // Navigate to home page after successful login
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          showToast('error', response.data.message, 'Login Failed');
        }
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      console.log(error);
      
      if (error.response && error.response.data && error.response.data.message) {
        showToast('error', error.response.data.message, 'Authentication Error');
      } else {
        showToast('error', 'An unexpected error occurred. Please try again later.', 'Connection Error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <>
      <motion.form
        onSubmit={onSubmitHandler}
        className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <motion.p
            className='prata-regular text-3xl'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentState}
          </motion.p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Login' ? '' : (
          <motion.input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Name'
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <motion.input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Email'
          required
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Password'
          required
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer' onClick={() => showResetPasswordToast()}>Forgot your password?</p>
          {currentState === 'Login' ? (
            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          ) : (
            <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
          )}
        </div>
        <motion.button
          className='bg-black text-white font-light px-8 py-2 mt-4 border hover:bg-white hover:text-black hover:border-black'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {currentState === 'Login' ? 'Logging in...' : 'Signing Up...'}
            </span>
          ) : (
            currentState === 'Login' ? 'Login' : 'Sign Up'
          )}
        </motion.button>
      </motion.form>
      
      {/* Toast Container with custom styles */}
      <ToastContainer
        position="top-center"
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        theme="light"
        limit={3}
      />
    </>
  );
};

export default Login;