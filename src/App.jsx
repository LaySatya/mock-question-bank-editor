import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import QuestionBank from './pages/QuestionBank/QuestionBank';
import ManageUsers from './pages/ManageUsers';
import LoginPage from './pages/LoginPage';
import { logoutUser } from './api/userapi';

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setIsAuthenticated(true);
      setCurrentUser({ token, username });
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setIsAuthenticated(true);
    setCurrentUser({ token, username });
    navigate('/question-bank'); // ✅ FIXED: Now matches your route
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('API logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsAuthenticated(false);
      setCurrentUser(null);
      
      // You can change this to redirect to different pages:
      // navigate('/login');           // Go to login page (current)
      // navigate('/');                // Go to home page
      // navigate('/goodbye');         // Go to custom goodbye page
      // window.location.href = '/';   // Hard redirect to home
      
      navigate('/login'); // Current behavior
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