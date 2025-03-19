import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return Promise.reject({
        message: 'Request took too long to respond. Please try again.',
        isTimeout: true
      });
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.error || error.message;
    return Promise.reject({
      message: errorMessage,
      isTimeout: false
    });
  }
);

export default api; 