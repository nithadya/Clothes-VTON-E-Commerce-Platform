import React, { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const { 
    setShowSearch, 
    getCartCount, 
    navigate, 
    token, 
    setToken, 
    setCartItems 
  } = useContext(ShopContext);

  const location = useLocation();

  // Handle scroll effect for all pages, with special styling for home
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Enhanced toast configurations
  const toastConfig = {
    position: "top-center",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
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

  const logout = () => {
    toast(
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-purple-600 rounded-full p-2 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V12M12 20V12M12 12H20M12 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-600 mt-1">Are you sure you want to logout?</p>
          </div>
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
              navigate("/login");
              localStorage.removeItem("token");
              setToken("");
              setCartItems({});
              setProfileDropdownOpen(false);
              
              // Show success toast after logout
              setTimeout(() => {
                toast(
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="bg-green-500 rounded-full p-2 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">Successfully signed out</p>
                      </div>
                    </div>
                  </div>,
                  {
                    ...toastConfig,
                    autoClose: 3000,
                    closeOnClick: true,
                    className: "custom-toast-container border-green-500", 
                  }
                );
              }, 300);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors toast-action-button"
          >
            Sign Out
          </button>
        </div>
      </div>,
      toastConfig
    );
  };

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

  // Active link style
  const activeLinkClass = ({ isActive }) => 
    `group relative ${isActive ? "text-purple-600 font-medium" : "text-gray-700"}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-lg shadow-lg py-3" 
            : location.pathname === "/" 
              ? "bg-transparent py-5" 
              : "bg-white py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Left Side - Logo */}
          <Link 
            to="/" 
            className="relative z-50 flex items-center"
            aria-label="Go to homepage"
          >
            <img
              src={assets.logo}
              className={`transition-all duration-300 ${isScrolled ? "w-28" : "w-32 md:w-36"}`}
              alt="Brand Logo"
            />
          </Link>

          {/* Middle - Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center space-x-8">
            <NavLink to="/" className={activeLinkClass}>
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span className="text-sm tracking-wide">HOME</span>
                  <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isActive ? "w-full bg-purple-600" : "bg-gray-700"}`}></div>
                </div>
              )}
            </NavLink>
            
            <NavLink to="/collection" className={activeLinkClass}>
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span className="text-sm tracking-wide">COLLECTION</span>
                  <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isActive ? "w-full bg-purple-600" : "bg-gray-700"}`}></div>
                </div>
              )}
            </NavLink>
            
            <NavLink to="/about" className={activeLinkClass}>
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span className="text-sm tracking-wide">ABOUT</span>
                  <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isActive ? "w-full bg-purple-600" : "bg-gray-700"}`}></div>
                </div>
              )}
            </NavLink>
            
            <NavLink to="/contact" className={activeLinkClass}>
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <span className="text-sm tracking-wide">CONTACT</span>
                  <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${isActive ? "w-full bg-purple-600" : "bg-gray-700"}`}></div>
                </div>
              )}
            </NavLink>
          </nav>

          {/* Right Side - Icons */}
          <div className="flex items-center space-x-5 md:space-x-6">
            {/* Search */}
            <button 
              onClick={() => setShowSearch(true)} 
              className="group p-1 focus:outline-none" 
              aria-label="Search"
            >
              <img
                src={assets.search_icon}
                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                alt="Search"
              />
            </button>

            {/* Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => token ? setProfileDropdownOpen(!profileDropdownOpen) : navigate("/login")} 
                className="group p-1 focus:outline-none"
                aria-label="Profile"
              >
                <img
                  src={assets.profile_icon}
                  className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                  alt="Profile"
                />
              </button>
              
              {/* Profile Dropdown Menu */}
              {token && (
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50"
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                      >
                        Orders
                      </Link>
                      <button 
                        onClick={logout} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                      >
                        SignOut
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative p-1 group focus:outline-none" aria-label="Shopping Cart">
              <img
                src={assets.cart_icon}
                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                alt="Cart"
              />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-medium">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-1 focus:outline-none" 
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-5">
                <span 
                  className={`absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 top-2" : "top-0"
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-gray-700 top-2 transition-opacity duration-300 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 top-2" : "top-4"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className={`h-16 md:h-20 ${location.pathname === "/" ? "lg:h-24" : ""}`}></div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-30 lg:hidden"
          >
            <div className="flex flex-col h-full pt-20 pb-6 px-6">
              <nav className="flex flex-col space-y-1 mt-4">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-lg ${isActive ? "text-purple-600 font-medium bg-purple-50 rounded-md" : "text-gray-800"}`
                  }
                >
                  HOME
                </NavLink>
                <NavLink 
                  to="/collection" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-lg ${isActive ? "text-purple-600 font-medium bg-purple-50 rounded-md" : "text-gray-800"}`
                  }
                >
                  COLLECTION
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-lg ${isActive ? "text-purple-600 font-medium bg-purple-50 rounded-md" : "text-gray-800"}`
                  }
                >
                  ABOUT
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => 
                    `py-3 px-4 text-lg ${isActive ? "text-purple-600 font-medium bg-purple-50 rounded-md" : "text-gray-800"}`
                  }
                >
                  CONTACT
                </NavLink>
              </nav>
              
              {/* Mobile User Actions */}
              {token ? (
                <div className="mt-auto border-t border-gray-200 pt-4">
                  <Link 
                    to="/profile" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600"
                  >
                    <img src={assets.profile_icon} className="w-5 h-5 mr-3" alt="" />
                    <span>My Profile</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center py-3 px-4 text-gray-700 hover:text-purple-600"
                  >
                    <span className="w-5 h-5 mr-3">📦</span>
                    <span>My Orders</span>
                  </Link>
                  <button 
                    onClick={logout} 
                    className="flex items-center w-full py-3 px-4 text-gray-700 hover:text-purple-600"
                  >
                    <span className="w-5 h-5 mr-3">🚪</span>
                    <span>SignOut</span>
                  </button>
                </div>
              ) : (
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Link 
                    to="/login" 
                    className="block w-full py-3 px-4 text-center bg-purple-600 text-white rounded-md font-medium"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full py-3 px-4 text-center bg-gray-100 text-gray-800 rounded-md font-medium mt-3"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default Navbar;