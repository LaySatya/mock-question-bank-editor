import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, User, HelpCircle, LogOut } from 'lucide-react';

const Navbar = ({ onToggleSidebar, sidebarOpen, theme, toggleTheme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const notifications = [
    { id: 1, message: "New student enrolled", time: "Just now", unread: true },
    { id: 2, message: "Quiz results ready", time: "10 min ago", unread: true },
    { id: 3, message: "System maintenance", time: "2h ago", unread: false },
  ];

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      notificationsRef.current && !notificationsRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
      setNotificationsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-md px-4 z-30">
      <div className="navbar-start">
        <button 
          className="btn btn-ghost lg:hidden" 
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <span className="text-xl font-bold">Rean Ot Lv</span>
      </div>

      <div className="navbar-center hidden lg:flex">
        <form className="input-group">
          <input 
            type="text" 
            placeholder="Search..." 
            className="input input-bordered w-64" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search"
          />
          <button className="btn btn-square btn-ghost" type="submit" aria-label="Search">
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="navbar-end flex items-center space-x-2">
        <button className="btn btn-ghost btn-circle" aria-label="Help">
          <HelpCircle size={20} />
        </button>
        <div className="dropdown dropdown-end" ref={notificationsRef}>
          <button 
            className="btn btn-ghost btn-circle indicator" 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="indicator-item badge badge-primary badge-sm">
              {notifications.filter(n => n.unread).length}
            </span>
          </button>
          {notificationsOpen && (
            <div className="dropdown-content z-50 menu p-2 shadow bg-base-100 rounded-box w-72 mt-4">
              <div className="p-2 border-b">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 hover:bg-base-200 rounded-lg cursor-pointer">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="dropdown dropdown-end" ref={dropdownRef}>
          <button 
            className="btn btn-ghost btn-circle avatar" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User Menu"
          >
            <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
              <User size={20} />
            </div>
          </button>
          {dropdownOpen && (
            <ul className="mt-3 p-2 shadow menu dropdown-content z-50 bg-base-100 rounded-box w-52">
              <li className="p-2 text-center border-b">
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-gray-500">admin@learnsphere.com</p>
              </li>
              <li><a className="py-2">Profile</a></li>
              <li><a className="py-2 text-error">Logout</a></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;