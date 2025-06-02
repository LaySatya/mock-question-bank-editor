import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/user';

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}`, { username, password });
    return response.data;
  } catch (error) {
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
