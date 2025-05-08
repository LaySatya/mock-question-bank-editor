import React, { useState } from 'react';
import { User, Bell, Lock, Shield, Database, HardDrive, Mail, CheckCircle, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    emailDigest: true,
    questionUpdates: false,
    studentProgress: true,
    systemUpdates: true
  });
  
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Profile Settings</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <User size={32} />
              </div>
              <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-gray-500 mb-2">Upload an image (recommended: 400x400px)</p>
                <button className="btn btn-sm btn-outline">Change Photo</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">First Name</span>
                </label>
                <input type="text" placeholder="First Name" className="input input-bordered w-full" defaultValue="John" />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Last Name</span>
                </label>
                <input type="text" placeholder="Last Name" className="input input-bordered w-full" defaultValue="Doe" />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input type="email" placeholder="Email" className="input input-bordered w-full" defaultValue="john.doe@example.com" />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Role</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>Administrator</option>
                  <option>Teacher</option>
                  <option>Course Creator</option>
                </select>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Time Zone</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                </select>
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Language</span>
                </label>
                <select className="select select-bordered w-full">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <button className="btn btn-primary">
                <Save size={18} className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <p className="text-gray-500">Configure how and when you receive notifications</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-500" />
                  <div>
                    <h3 className="font-medium">Email Digest</h3>
                    <p className="text-sm text-gray-500">Receive daily summary of activities</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={notificationSettings.emailDigest}
                  onChange={() => handleNotificationChange('emailDigest')}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-500" />
                  <div>
                    <h3 className="font-medium">Question Bank Updates</h3>
                    <p className="text-sm text-gray-500">Get notified when questions are added or modified</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={notificationSettings.questionUpdates}
                  onChange={() => handleNotificationChange('questionUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Users size={20} className="text-gray-500" />
                  <div>
                    <h3 className="font-medium">Student Progress</h3>
                    <p className="text-sm text-gray-500">Updates on student achievements and milestones</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={notificationSettings.studentProgress}
                  onChange={() => handleNotificationChange('studentProgress')}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <HardDrive size={20} className="text-gray-500" />
                  <div>
                    <h3 className="font-medium">System Updates</h3>
                    <p className="text-sm text-gray-500">Notifications about system changes and maintenance</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={notificationSettings.systemUpdates}
                  onChange={() => handleNotificationChange('systemUpdates')}
                />
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button className="btn btn-primary">
                <Save size={18} className="mr-2" /> Save Preferences
              </button>
              <button className="btn btn-outline">Reset to Default</button>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Security Settings</h2>
            
            <div className="bg-base-100 p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Current Password</span>
                  </label>
                  <input type="password" placeholder="Enter current password" className="input input-bordered w-full" />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">New Password</span>
                  </label>
                  <input type="password" placeholder="Enter new password" className="input input-bordered w-full" />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Confirm New Password</span>
                  </label>
                  <input type="password" placeholder="Confirm new password" className="input input-bordered w-full" />
                </div>
              </div>
              
              <button className="btn btn-primary mt-4">
                <Lock size={18} className="mr-2" /> Update Password
              </button>
            </div>
            
            <div className="bg-base-100 p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
              <p className="text-gray-500 mb-4">Add an extra layer of security to your account</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable 2FA</h4>
                  <p className="text-sm text-gray-500">Require a verification code when logging in</p>
                </div>
                <input type="checkbox" className="toggle toggle-primary" />
              </div>
              
              <button className="btn btn-outline mt-4">Configure 2FA</button>
            </div>
            
            <div className="bg-base-100 p-6 rounded-lg border border-error/20">
              <h3 className="text-lg font-medium mb-4 text-error">Danger Zone</h3>
              <p className="text-gray-500 mb-4">Actions here can't be undone</p>
              
              <button className="btn btn-outline btn-error">Delete Account</button>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">System Settings</h2>
            <p className="text-gray-500">Configure system-wide preferences</p>
            
            <div className="bg-base-100 p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Appearance</h3>
              
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="radio" name="theme" className="radio radio-primary mr-3" checked />
                  <span className="label-text">Light Mode</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="radio" name="theme" className="radio radio-primary mr-3" />
                  <span className="label-text">Dark Mode</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="radio" name="theme" className="radio radio-primary mr-3" />
                  <span className="label-text">System Default</span>
                </label>
              </div>
            </div>
            
            <div className="bg-base-100 p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Data Management</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatic Backups</h4>
                    <p className="text-sm text-gray-500">Create regular backups of your data</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary" checked />
                </div>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Backup Frequency</span>
                  </label>
                  <select className="select select-bordered w-full">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button className="btn btn-outline">Create Backup Now</button>
                  <button className="btn btn-outline">Restore From Backup</button>
                </div>
              </div>
            </div>
            
            <div className="bg-base-100 p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Integrations</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">Google Workspace</h4>
                      <p className="text-xs text-gray-500">Connect to Google Classroom</p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline">Connect</button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">Microsoft Teams</h4>
                      <p className="text-xs text-gray-500">Connect to Teams for Education</p>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-success btn-outline">Connected <CheckCircle size={14} className="ml-1" /></button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and system configuration</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
            <ul className="menu menu-lg p-0 w-full">
              <li>
                <button 
                  className={`py-3 ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={18} /> Profile
                </button>
              </li>
              <li>
                <button 
                  className={`py-3 ${activeTab === 'notifications' ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell size={18} /> Notifications
                </button>
              </li>
              <li>
                <button 
                  className={`py-3 ${activeTab === 'security' ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={18} /> Security
                </button>
              </li>
              <li>
                <button 
                  className={`py-3 ${activeTab === 'system' ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  onClick={() => setActiveTab('system')}
                >
                  <Database size={18} /> System
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="bg-base-100 rounded-lg shadow-sm p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;