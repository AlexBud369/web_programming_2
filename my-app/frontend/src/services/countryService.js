import api from './api';

export const getCountries = async (params) => {
  try {
    const response = await api.get('/countries', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error.response?.data || error.message);
    throw error;
  }
};

export const getCountryById = async (id) => {
  try {
    const response = await api.get(`/countries/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching country ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createCountry = async (data) => {
  try {
    const formattedData = {
      ...data,
      visaCost: data.visaCost ? parseFloat(data.visaCost.toString().replace(',', '.')) : 0  // Handle locale comma
    };

    const response = await api.post('/countries', formattedData);
    return response.data;
  } catch (error) {
    const serverError = error.response?.data;
    let errorMessage = 'Ошибка при создании страны';
    
    if (serverError?.errors?.length > 0) {
      errorMessage = serverError.errors.map(e => `${e.field}: ${e.message}`).join('\n');
    } else if (serverError?.message) {
      errorMessage = serverError.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const updateCountry = async (id, data) => {
  try {
    const formattedData = {
      ...data,
      visaCost: data.visaCost ? parseFloat(data.visaCost.toString().replace(',', '.')) : 0
    };
    const response = await api.put(`/countries/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating country ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteCountry = async (id) => {
  try {
    await api.delete(`/countries/${id}`);
  } catch (error) {
    console.error(`Error deleting country ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const checkCountryExists = async (id) => {
  try {
    const response = await api.head(`/countries/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error checking country ${id}:`, error.response?.data || error.message);
    return false;
  }
};