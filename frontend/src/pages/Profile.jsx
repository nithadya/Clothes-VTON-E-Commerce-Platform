import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  FaUser, 
  FaEdit, 
  FaLock, 
  FaShoppingBag, 
  FaAddressCard, 
  FaBell, 
  FaQuestionCircle,
  FaSignOutAlt
} from "react-icons/fa";

const UserProfile = () => {
  const { token, backendUrl, navigate, logout } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    fetchUserData();
    fetchAddresses();
    fetchOrderHistory();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });
  
      if (response.data.success) {
        setUserData(response.data.user);
        setUpdatedName(response.data.user.name);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      // Mockup for demo purposes
      setAddresses([
        {
          id: 1,
          type: "Home",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
          isDefault: true
        },
        {
          id: 2,
          type: "Work",
          address: "456 Office Avenue",
          city: "New York",
          state: "NY",
          zip: "10002",
          country: "USA",
          isDefault: false
        }
      ]);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      // Mockup for demo purposes
      setOrderHistory([
        {
          id: "ORD-1234",
          date: new Date(2025, 2, 15),
          total: 129.99,
          status: "Delivered",
          items: 3
        },
        {
          id: "ORD-1235",
          date: new Date(2025, 1, 28),
          total: 89.99,
          status: "Processing",
          items: 2
        },
        {
          id: "ORD-1236",
          date: new Date(2025, 1, 10),
          total: 45.50,
          status: "Delivered",
          items: 1
        }
      ]);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/update`,
        { name: updatedName },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Profile updated successfully");
        setUserData({ ...userData, name: updatedName });
        setEditMode(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/change-password`,
        { currentPassword, newPassword },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    try {
      // Mockup API call
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-4">
            <div className="bg-white shadow-sm rounded-xl p-6">
              <div className="flex flex-col items-center mb-6">
                {userData?.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt={userData.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">{userData?.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">{userData?.name}</h2>
                <p className="text-gray-600">{userData?.email}</p>
                <div className="mt-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  {userData?.memberSince ? `Member since ${new Date(userData.memberSince).getFullYear()}` : "Premium Member"}
                </div>
              </div>
              
              <nav className="flex flex-col space-y-1">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === "profile" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
                >
                  <FaUser className="mr-3" />
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === "orders" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
                >
                  <FaShoppingBag className="mr-3" />
                  <span>Order History</span>
                </button>
                <button 
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === "addresses" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
                >
                  <FaAddressCard className="mr-3" />
                  <span>Addresses</span>
                </button>
                <button 
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === "security" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
                >
                  <FaLock className="mr-3" />
                  <span>Security</span>
                </button>
                <button 
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === "notifications" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
                >
                  <FaBell className="mr-3" />
                  <span>Notifications</span>
                </button>
                <button 
                  onClick={() => setActiveTab("help")}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${activeTab === "help" ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"}`}
                >
                  <FaQuestionCircle className="mr-3" />
                  <span>Help & Support</span>
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition w-full px-4 py-2"
                >
                  <FaSignOutAlt className="mr-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Your Premium Membership</h3>
              <p className="text-blue-100 mb-4">Enjoy exclusive benefits and discounts</p>
              <button className="bg-white text-blue-600 hover:bg-blue-50 transition px-4 py-2 rounded-lg font-medium text-sm">
                View Benefits
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow-sm rounded-xl p-6">
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaEdit className="mr-2" />
                      {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>
                  
                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="max-w-2xl">
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={userData?.email}
                          className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-500 bg-gray-50 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Please contact support for assistance.</p>
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          placeholder="Enter your phone number"
                          className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Full Name</p>
                          <p className="font-medium text-gray-900">{userData?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email Address</p>
                          <p className="font-medium text-gray-900">{userData?.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                          <p className="font-medium text-gray-900">{userData?.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                          <p className="font-medium text-gray-900">{userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Account Created</p>
                        <p className="font-medium text-gray-900">
                          {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "Not available"}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">Delete Account</h3>
                          <p className="text-sm text-gray-500">Once deleted, your account cannot be recovered.</p>
                        </div>
                        <button className="bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-6 rounded-lg transition">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  
                  {orderHistory.length > 0 ? (
                    <div className="space-y-6">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-gray-50 border-b border-gray-200">
                            <div>
                              <h3 className="font-bold text-gray-900">{order.id}</h3>
                              <p className="text-sm text-gray-500">
                                {order.date.toLocaleDateString("en-US", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center gap-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "Delivered" ? "bg-green-100 text-green-800" : 
                                order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {order.status}
                              </span>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View Details
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-500">{order.items} {order.items === 1 ? "item" : "items"}</span>
                              <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <button className="text-sm text-gray-600 hover:text-gray-900">
                                Track Package
                              </button>
                              <button className="text-sm text-gray-600 hover:text-gray-900">
                                Buy Again
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaShoppingBag className="text-gray-400 text-xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">When you place an order, it will appear here</p>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition">
                      Add New Address
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        <h3 className="font-bold text-gray-900 mb-1">{address.type}</h3>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">{address.city}, {address.state} {address.zip}</p>
                        <p className="text-gray-600 mb-4">{address.country}</p>
                        <div className="flex gap-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Delete
                          </button>
                          {!address.isDefault && (
                            <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-8 max-w-2xl">
                    <div className="pb-6 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
                      <form onSubmit={handleChangePassword}>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            minLength="8"
                          />
                          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                        </div>
                        <div className="mb-6">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            minLength="8"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                      <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <form onSubmit={handleUpdatePreferences} className="max-w-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="font-bold text-gray-900">Email Notifications</h3>
                          <p className="text-gray-600 text-sm">Receive order updates and shipping notifications</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.emailNotifications}
                            onChange={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="font-bold text-gray-900">Push Notifications</h3>
                          <p className="text-gray-600 text-sm">Get notified about orders and account activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.pushNotifications}
                            onChange={() => setPreferences({...preferences, pushNotifications: !preferences.pushNotifications})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="font-bold text-gray-900">Marketing Emails</h3>
                          <p className="text-gray-600 text-sm">Receive promotional offers and product updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.marketingEmails}
                            onChange={() => setPreferences({...preferences, marketingEmails: !preferences.marketingEmails})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <button
                        type="submit"
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === "help" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-bold text-gray-900 mb-2">Need assistance?</h3>
                      <p className="text-gray-600 mb-4">Our customer support team is available 24/7 to help you with any questions or concerns.</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center justify-center">
                          <FaQuestionCircle className="mr-2" />
                          Contact Support
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                          Browse FAQs
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                      
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-bold text-gray-900 mb-2">How do I track my order?</h4>
                          <p className="text-gray-600">You can track your order by visiting the Order History section and clicking on "Track Package" next to your order.</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-bold text-gray-900 mb-2">How can I return an item?</h4>
                          <p className="text-gray-600">To return an item, go to your Order History, select the order containing the item, and click on "Return Item". Follow the instructions to complete your return.</p>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-bold text-gray-900 mb-2">How do I update my payment information?</h4>
                          <p className="text-gray-600">You can update your payment information in the Payment Methods section of your account settings.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Feed - Floating Card */}
      <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-xl p-4 w-72 border border-gray-100 hidden lg:block">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Recent Activity</h3>
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
            <div>
              <p className="text-sm text-gray-700">Your order <span className="font-semibold">ORD-1234</span> has been delivered.</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
            <div>
              <p className="text-sm text-gray-700">Your account has been verified.</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 w-2 h-2 rounded-full bg-purple-500"></div>
            <div>
              <p className="text-sm text-gray-700">You earned 50 reward points from your last purchase.</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4 font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default UserProfile;