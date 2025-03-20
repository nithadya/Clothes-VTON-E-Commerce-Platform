import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ userName = "Name of Admin", userRole = "Admin" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const location = useLocation();
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Close sidebar on mobile when changing routes
  useEffect(() => {
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobileView]);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileView && 
          isSidebarOpen && 
          !e.target.closest('.sidebar') && 
          !e.target.closest('.sidebar-toggle')) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileView, isSidebarOpen]);

  // Navigation items
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      bgColor: "bg-indigo-50",
      activeColor: "text-indigo-600",
      activeBg: "bg-indigo-100"
    },
    {
      name: "Add Items",
      path: "/add",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "bg-emerald-50",
      activeColor: "text-emerald-600",
      activeBg: "bg-emerald-100"
    },
    {
      name: "List Items",
      path: "/list",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      activeColor: "text-blue-600",
      activeBg: "bg-blue-100"
    },
    {
      name: "Orders",
      path: "/orders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      ),
      bgColor: "bg-amber-50",
      activeColor: "text-amber-600",
      activeBg: "bg-amber-100"
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      bgColor: "bg-purple-50",
      activeColor: "text-purple-600",
      activeBg: "bg-purple-100"
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      bgColor: "bg-gray-50",
      activeColor: "text-gray-600",
      activeBg: "bg-gray-100"
    }
  ];

  // Animations
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { 
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const overlayVariants = {
    open: { opacity: 0.5, display: "block" },
    closed: { opacity: 0, transitionEnd: { display: "none" } }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileView && isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black z-20"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="sidebar-toggle fixed top-4 left-4 z-50 p-2 bg-white text-gray-800 rounded-lg shadow-lg md:hidden flex items-center justify-center"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <motion.div
        className="sidebar fixed md:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto z-30 flex flex-col"
        initial={isMobileView ? "closed" : "open"}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={isMobileView ? sidebarVariants : {}}
      >
        {/* Brand & Logo */}
        {/* <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Manage everything</p>
            </div>
          </div>
        </div> */}

        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              {userName.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{userName}</h3>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="px-3 mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main Menu
            </h2>
          </div>
          
          <ul className="space-y-1 px-3">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? `${item.activeBg} ${item.activeColor} font-medium` 
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className={`p-1 rounded-md ${item.bgColor} ${location.pathname === item.path ? item.activeColor : 'text-gray-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  
                  {/* New badge for demonstrating conditional rendering */}
                  {item.name === "Analytics" && (
                    <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Additional Menu Section */}
          <div className="mt-6 px-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Help & Support
            </h2>
            <ul className="mt-3 space-y-1">
              <li>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <span className="p-1 rounded-md bg-red-50 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <span className="p-1 rounded-md bg-teal-50 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </span>
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 border-t text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>© 2025</span>
            <span>•</span>
            <button className="hover:text-indigo-600 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;