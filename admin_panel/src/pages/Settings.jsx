import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Settings = () => {
  // State for various settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Acme Industries',
    adminEmail: 'admin@acmeindustries.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiryDays: 90,
    sessionTimeout: 30,
    ipRestriction: false,
    allowedIPs: '',
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'sk_test_51Hb6rXCjy7VF',
    webhookUrl: 'https://webhook.acmeindustries.com/api/events',
    apiRateLimit: 100,
  });

  // Functions to handle form changes
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleApiChange = (e) => {
    const { name, value } = e.target;
    setApiSettings(prev => ({ ...prev, [name]: value }));
  };

  // Function to save settings
  const saveSettings = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to save the settings
    console.log('Saving settings:', {
      generalSettings,
      notificationSettings,
      securitySettings,
      apiSettings
    });
    toast.success('Settings saved successfully');
  };

  // Function to reset API key
  const resetApiKey = () => {
    const newApiKey = 'sk_test_' + Math.random().toString(36).substring(2, 15);
    setApiSettings(prev => ({ ...prev, apiKey: newApiKey }));
    toast.info('API Key has been reset');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>
      
      <form onSubmit={saveSettings}>
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={generalSettings.companyName}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                name="adminEmail"
                value={generalSettings.adminEmail}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={generalSettings.timezone}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <select
                name="dateFormat"
                value={generalSettings.dateFormat}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={generalSettings.language}
                onChange={handleGeneralChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Notification Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                name="pushNotifications"
                checked={notificationSettings.pushNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                Push Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="orderUpdates"
                name="orderUpdates"
                checked={notificationSettings.orderUpdates}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="orderUpdates" className="ml-2 block text-sm text-gray-700">
                Order Updates
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="systemAlerts"
                name="systemAlerts"
                checked={notificationSettings.systemAlerts}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="systemAlerts" className="ml-2 block text-sm text-gray-700">
                System Alerts
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketingEmails"
                name="marketingEmails"
                checked={notificationSettings.marketingEmails}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                Marketing Emails
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Security Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                name="twoFactorAuth"
                checked={securitySettings.twoFactorAuth}
                onChange={handleSecurityChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
                Enable Two-Factor Authentication
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Expiry (days)
              </label>
              <input
                type="number"
                name="passwordExpiryDays"
                min="0"
                max="365"
                value={securitySettings.passwordExpiryDays}
                onChange={handleSecurityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                name="sessionTimeout"
                min="5"
                max="120"
                value={securitySettings.sessionTimeout}
                onChange={handleSecurityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ipRestriction"
                name="ipRestriction"
                checked={securitySettings.ipRestriction}
                onChange={handleSecurityChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="ipRestriction" className="ml-2 block text-sm text-gray-700">
                Enable IP Restriction
              </label>
            </div>
            {securitySettings.ipRestriction && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed IP Addresses (comma separated)
                </label>
                <input
                  type="text"
                  name="allowedIPs"
                  value={securitySettings.allowedIPs}
                  onChange={handleSecurityChange}
                  placeholder="192.168.1.1, 10.0.0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">API Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="apiKey"
                  value={apiSettings.apiKey}
                  onChange={handleApiChange}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
                <button
                  type="button"
                  onClick={resetApiKey}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none"
                >
                  Reset
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Keep this key secret. Resetting will invalidate the previous key.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                name="webhookUrl"
                value={apiSettings.webhookUrl}
                onChange={handleApiChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Rate Limit (requests per minute)
              </label>
              <input
                type="number"
                name="apiRateLimit"
                min="10"
                max="1000"
                value={apiSettings.apiRateLimit}
                onChange={handleApiChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;