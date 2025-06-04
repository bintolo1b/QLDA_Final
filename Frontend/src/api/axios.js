import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://192.168.170.15:7070',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    if (response) {
      // Handle specific error status codes
      switch (response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized access - logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Only redirect to login if we're not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          // Other errors
          console.error(`API Error: ${response.status}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error or server not responding');
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 