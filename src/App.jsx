import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import QuestionEditor from './pages/QuestionEditor';
import Settings from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Handle theme switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="flex h-screen bg-base-200">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0 md:w-20'
          }`}
          aria-label="Sidebar"
        >
          <Sidebar sidebarOpen={sidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          {/* Main Section */}
          <main className="flex-1 overflow-auto bg-base-100 p-0">
            <div className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/question-bank" element={<QuestionBank />} />
                <Route path="/question-bank/editor" element={<QuestionEditor />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-base-100 border-t border-base-300 py-2 px-6 text-center text-sm text-base-content/70">
            <p>© 2025 Rean Ot Lv Learning Management System</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;