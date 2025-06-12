import React, { useState } from 'react';
import { loginUser } from '../api/userapi';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedUsername || !trimmedPassword) {
      setError('Username and password are required');
      return;
    }
  
    console.log('Submitting login:', { username: trimmedUsername, password: trimmedPassword });
    setIsLoading(true);
  
    try {
      const response = await loginUser(trimmedUsername, trimmedPassword);
      console.log('Login response:', response);
  
      localStorage.setItem('token', response.token);
      const actualUsername = response.username || response.usernameoremail || response.user || trimmedUsername;
      localStorage.setItem('usernameoremail', actualUsername);
  
      if (onLogin) {
        onLogin(response.token, actualUsername);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <div className="flex flex-col ">
          <img
            src="/src/assets/icon_text/CADT-Masterbrand-Logos-Navy_CADT-Lockup-1-English.png"
           
            alt="CADT Logo"
            width={220}
            height={48}
            className="mb-6"
          />
          <h2 className="text-center text-3xl  font-extrabold text-gray-900 mb-2">
            Sign in
          </h2>
        </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="usernameoremail" className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="text"
              id="usernameoremail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="usernameoremail"
              // required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="current-password"
              
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;