import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 30000, // Increase timeout to 30 seconds for potentially slow API responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging in production
api.interceptors.request.use(
  (config) => {
    // Log the request in development or when debugging is enabled
    if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEBUG === 'true') {
      console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 