import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

const Header = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { isLoaded, user } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between">
      {/* Left side - Menu Toggle */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right side - User Greeting and Button */}
      <div className="flex items-center space-x-3">
        <span className="text-s font-medium text-black">
          {isLoaded && user ? `Hello ${user.firstName} ${user.lastName}!` : ''}
        </span>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;