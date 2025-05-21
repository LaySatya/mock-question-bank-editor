import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileQuestion, User } from 'lucide-react';

const Sidebar = ({ collapsed }) => {
  // Navigation items
  const navItems = [
    { 
      label: 'Dashboard', 
      icon: <Home size={20} />, 
      path: '/' 
    },
    { 
      label: 'Question Bank', 
      icon: <FileQuestion size={20} />, 
      path: '/question-bank' 
    },
     { 
      label: 'Manage Users', 
      icon: <User size={20} />, 
      path: '/manage-users' 
    }
  ];

  return (
    <aside 
      className={`bg-indigo-800 text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } relative`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center h-16 px-4 border-b border-indigo-700">
        {collapsed ? (
          <div className="w-full flex justify-center">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
              <span className="text-indigo-800 font-bold text-lg">Q</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center mr-2">
              <span className="text-indigo-800 font-bold text-lg">Q</span>
            </div>
            <span className="font-bold text-lg">Rean Ot lv </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="py-4">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="mb-1">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 ${
                    isActive 
                      ? 'bg-indigo-900 text-white' 
                      : 'text-indigo-200 hover:bg-indigo-700'
                  } transition-colors duration-200 ${
                    collapsed ? 'justify-center' : ''
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;