import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ setToken, user = { name: "Admin Name", email: "admin@example.com", phone: "+9471 456-7890" } }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setShowProfileDetails(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setShowProfileDetails(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  const toggleProfileDropdown = () => setIsProfileOpen(prev => !prev);
  
  const handleProfileClick = () => setShowProfileDetails(true);
  
  const handleBackToOptions = () => setShowProfileDetails(false);
  
  const handleLogout = () => {
    setToken('');
    setIsProfileOpen(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-3 px-4 md:px-6 lg:px-8 bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center space-x-4">
        {/* Logo with hover effect */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="h-8 md:h-10 w-auto"
          src={assets.logo}
          alt="Company Logo"
        />
        
        {/* Optional: Navigation Links */}
        {/* <div className="hidden md:flex space-x-6 ml-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200">Projects</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200">Team</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200">Reports</a>
        </div> */}
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Optional: Search Button */}
        {/* <button 
          className="hidden md:flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button> */}
        
        {/* Optional: Notifications */}
        <button 
          className="relative flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          aria-label="Notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {/* Notification badge */}
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm">
                {user.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-400 rounded-full border-2 border-white"></span>
            </div>
            <span className="hidden md:inline-block text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
            <svg 
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="menu"
                aria-orientation="vertical"
              >
                {showProfileDetails ? (
                  <div className="p-4">
                    <button
                      onClick={handleBackToOptions}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to menu
                    </button>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-xs text-gray-500">Premium Account</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{user.phone}</span>
                      </div>
                    </div>
                    
                    <button
                      className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="py-1" role="none">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>
                      
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                      
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help Center
                      </button>
                    </div>
                    
                    {/* Logout */}
                    <div className="py-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;