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
