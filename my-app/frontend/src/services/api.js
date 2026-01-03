import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('No response from server');
    } else {
      console.log('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;