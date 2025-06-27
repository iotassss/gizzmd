import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      browser: false,
    },
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hasChanges = () => {
    return (
      formData.name !== (user?.name || '') ||
      formData.email !== (user?.email || '') ||
      formData.theme !== 'light' ||
      formData.language !== 'en'
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex items-center space-x-4">
                <span className={formData.theme === 'light' ? 'font-semibold text-blue-600' : 'text-gray-500'}>Light</span>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${formData.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
                  onClick={() => handleInputChange('theme', formData.theme === 'light' ? 'dark' : 'light')}
                  aria-label="Toggle theme"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${formData.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
                <span className={formData.theme === 'dark' ? 'font-semibold text-blue-600' : 'text-gray-500'}>Dark</span>
              </div>
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Notifications Section */}
        {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Browser Notifications</label>
                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.browser}
                  onChange={(e) => handleNotificationChange('browser', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div> */}

        {/* Security Section */}
        {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-4">
            <button className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700">Change Password</div>
                <div className="text-sm text-gray-500">Update your account password</div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-left">
                <div className="text-sm font-medium text-gray-700">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">Add an extra layer of security</div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div> */}

        {/* Danger Zone */}
        {/* <div className="bg-white border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <button className="flex items-center justify-between w-full p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
              <div className="text-left">
                <div className="text-sm font-medium">Delete Account</div>
                <div className="text-sm text-red-500">Permanently delete your account and all data</div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div> */}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Settings;
