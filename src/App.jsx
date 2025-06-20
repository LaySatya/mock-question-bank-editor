import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
// ✅ FIXED: Updated import path for QuestionBank
import QuestionBank from './features/questions/pages/QuestionBank';
import ManageUsers from './pages/ManageUsers';
import LoginPage from './pages/LoginPage';
import { logoutUser } from './api/userapi';
import './styles/moodle-question-bank.css';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usernameoremail = localStorage.getItem('usernameoremail');
    
    if (token && usernameoremail && usernameoremail !== 'undefined') {
      setIsAuthenticated(true);
      setCurrentUser({ token, username: usernameoremail });
    } else if (token && (!usernameoremail || usernameoremail === 'undefined')) {
      // Clean up if we have invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('usernameoremail');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token, usernameoremail) => {
    // Ensure we have a valid username
    const validUsername = usernameoremail && usernameoremail !== 'undefined' ? usernameoremail : 'User';
    
    localStorage.setItem('token', token);
    localStorage.setItem('usernameoremail', validUsername);
    setIsAuthenticated(true);
    setCurrentUser({ token, username: validUsername });
    navigate('/question-bank'); 
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('API logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usernameoremail');
      setIsAuthenticated(false);
      setCurrentUser(null);
      
      navigate('/login');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {isAuthenticated && <Sidebar collapsed={sidebarCollapsed} />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {isAuthenticated && (
          <Header 
            toggleSidebar={() => setSidebarCollapsed(prev => !prev)} 
            onLogout={handleLogout}
            username={currentUser?.username}
          />
        )}
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? 
                <Navigate to="/question-bank" replace /> : 
                <LoginPage onLogin={handleLogin} />
              }
            />
            <Route
              path="/question-bank"
              element={
                isAuthenticated ? 
                <QuestionBank /> : 
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/manage-users"
              element={
                isAuthenticated ? 
                <ManageUsers /> : 
                <Navigate to="/login" replace />
              }
            />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/question-bank" : "/login"} replace />
              }
            />
            <Route 
              path="*" 
              element={<div className="text-center p-10">Page not found</div>} 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;