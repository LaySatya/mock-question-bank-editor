import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('/dashboard');

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/question-bank', name: 'Question Bank', icon: <BookOpen size={18} /> },
    { path: '/students', name: 'Students', icon: <Users size={18} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <div className={`bg-base-100 h-screen border-r border-base-300 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-center border-b border-base-200">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
            RO
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-lg">Rean Ot Lv</span>}
        </div>
        <div className="flex-grow overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-colors ${
                    activeItem === item.path ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-base-200'
                  }`}
                  onClick={() => handleItemClick(item.path)}
                  aria-label={item.name}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-base-200">
          <button
            className="w-full text-left px-3 py-2 rounded-lg flex items-center text-error hover:bg-base-200 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={18} className="mr-3" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;