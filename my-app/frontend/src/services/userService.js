import api from './api';

export const getUsers = async (params) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const response = await api.post('/users', data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const changeUserRole = async (id, role) => {
  try {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error changing role for user ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const bulkUpdateUserRoles = async (updates) => {
  try {
    const response = await api.post('/users/bulk-update-roles', { 
      updates: updates.map(u => ({
        id: u.id,
        role: u.role
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error('Ошибка массового обновления ролей:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const serverMessage = error.response?.data?.message || 
                         error.response?.data?.errors?.[0]?.msg || 
                         error.response?.data?.error ||
                         'Ошибка сервера при обновлении ролей';
    
    throw new Error(serverMessage);
  }
};

export const checkUserExists = async (id) => {
  try {
    const response = await api.get(`/users/${id}/exists`);
    return response.data.exists;
  } catch (error) {
    console.error(`Error checking user ${id}:`, error.response?.data || error.message);
    return false;
  }
};

export const exportUsersToExcel = async (params) => {
  try {
    const response = await api.get('/users', { 
      params: { ...params, limit: 1000 },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting users:', error.response?.data || error.message);
    throw error;
  }
};