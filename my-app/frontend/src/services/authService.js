import api from './api';

const retryRequestWithRefresh = async (requestFn, ...args) => {
  try {
    return await requestFn(...args);
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw error;
      
      try {
        const refreshResponse = await api.post('/auth/refresh-token', { refreshToken });
        
        localStorage.setItem('accessToken', refreshResponse.data.accessToken);
        localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
        
        return await requestFn(...args);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        throw refreshError;
      }
    }
    throw error;
  }
};

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (refreshToken) => {
    return await api.post('/auth/logout', { refreshToken });
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  requestPasswordReset: async (email) => {
    return await api.post('/auth/request-password-reset', { email });
  },

  resetPassword: async (token, newPassword) => {
    return await api.post('/auth/reset-password', { token, newPassword });
  },

  getProfile: async () => {
    return retryRequestWithRefresh(async () => {
      const response = await api.get('/auth/profile');
      return response.data;
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return await api.post('/auth/change-password', { currentPassword, newPassword });
  }
};