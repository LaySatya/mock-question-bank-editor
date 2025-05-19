import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      {/* Left side - Menu Toggle and Search */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        
        {/* <div className="hidden md:flex items-center ml-4 bg-gray-100 px-3 py-2 rounded-md">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 bg-transparent border-none focus:outline-none text-sm"
          />
        </div> */}
      </div>
      
      {/* Right side - Notifications and Profile */}
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User size={18} className="text-indigo-800" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">Pisey Tep</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <a href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;