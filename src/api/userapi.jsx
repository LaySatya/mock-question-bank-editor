import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/users';
export const loginUser = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('usernameoremail', username);     
    params.append('password', password);     

    const response = await axios.post(
      `${API_URL}`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    // Check if the backend says login failed
    if (!response.data.status) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    return response.data;
  } catch (error) {
    // If it's our custom error, throw it
    if (error.message && !error.response) {
      throw error;
    }
    // Otherwise handle HTTP errors
    throw error.response ? error.response.data : new Error('Network error');
  }
};




// Add logout function if your backend supports it
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Logout API error:', error);
    // Continue with local logout even if API fails
  }
};



///use for get user from api for place manage user 
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if needed
      }
    });
    // If your API returns { users: [...] }, return response.data.users
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch users');
  }
};


// Optionally, group all functions in an object for easier import:
export const userAPI = {
  loginUser,
  logoutUser,
  getUsers,
};