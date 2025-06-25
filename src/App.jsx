import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
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
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const usernameoremail = localStorage.getItem('usernameoremail');
      const userid = localStorage.getItem('userid');
      
      if (token && usernameoremail && usernameoremail !== 'undefined' && userid) {
        try {
          // Add token verification API call if needed
          // await verifyToken(token); 
          
          setIsAuthenticated(true);
          setCurrentUser({ 
            token, 
            username: usernameoremail,
            id: userid 
          });
        } catch (error) {
          // If token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('usernameoremail');
          localStorage.removeItem('userid');
          setIsAuthenticated(false);
          navigate('/login');
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, [navigate]);

  const handleLogin = (token, username, userid) => {
    console.log('Handling login with:', { token, username, userid });
    
    localStorage.setItem('token', token);
    localStorage.setItem('usernameoremail', username);
    localStorage.setItem('userid', userid);
    
    setIsAuthenticated(true);
    setCurrentUser({
      token,
      username,
      id: userid
    });
    
    // Navigate to dashboard by default
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('API logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usernameoremail');
      localStorage.removeItem('userid');
      setIsAuthenticated(false);
      setCurrentUser(null);
      
      navigate('/login');
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
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
            {/* Login Route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LoginPage onLogin={handleLogin} />
              }
            />
            
            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? 
                <Dashboard /> : 
                <Navigate to="/login" replace />
              }
            />
            
            {/* Question Bank Route */}
            <Route
              path="/question-bank"
              element={
                isAuthenticated ? 
                <QuestionBank /> : 
                <Navigate to="/login" replace />
              }
            />
            
            {/* Manage Users Route */}
            <Route
              path="/manage-users"
              element={
                isAuthenticated ? 
                <ManageUsers /> : 
                <Navigate to="/login" replace />
              }
            />
            
            {/* Root Route - redirect to dashboard if authenticated, login if not */}
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              }
            />
            
            {/* Catch-all route for 404 */}
            <Route 
              path="*" 
              element={
                <div className="flex flex-col items-center justify-center min-h-96 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-6">Page not found</p>
                  <button 
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;