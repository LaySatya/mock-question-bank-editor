// Header.jsx - Fixed profile image display
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from '../LogoutConfirmationModal';

const Header = ({ toggleSidebar, onLogout, username, profileImageUrl }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  
  // Reset image error when profileImageUrl changes
  useEffect(() => {
    if (profileImageUrl) {
      setImgError(false);
    }
  }, [profileImageUrl]);

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Log profile image URL for debugging
  useEffect(() => {
    console.log("Profile image URL in Header:", profileImageUrl);
  }, [profileImageUrl]);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {username}</span>
            
            {/* User dropdown menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
              >
                {/* Profile Image: Only try to render if we have a URL and no error */}
                {profileImageUrl && !imgError ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={() => {
                      console.log("Image failed to load:", profileImageUrl);
                      setImgError(true);
                    }}
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-medium text-sm">
                      {username ? username.charAt(0).toUpperCase() : "U"}
                    </span>
                  </span>
                )}
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{username}</div>
                    <div className="text-gray-500">Signed in</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowDropdown(false)}
          ></div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Header;