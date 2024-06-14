import axios from 'axios';

// Set up an instance of Axios with the base URL of your backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
