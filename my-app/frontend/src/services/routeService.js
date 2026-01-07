import api from './api';

export const getRoutes = async (params) => {
  try {
    const response = await api.get('/routes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error.response?.data || error.message);
    throw error;
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching route ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createRoute = async (data) => {
  try {
    console.log('Creating route with data:', data);
    
    const formattedData = {
      ...data,
      price: data.price ? parseFloat(data.price.toString().replace(',', '.')) : 0,
      durationDays: data.durationDays ? parseInt(data.durationDays.toString()) : 1,
      countryId: parseInt(data.countryId),
      isActive: data.isActive === 'true' || data.isActive === true
    };
    
    console.log('Formatted route data:', formattedData);
    
    const response = await api.post('/routes', formattedData);
    console.log('Route created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    console.error('Server error response:', error.response?.data);
    
    const serverError = error.response?.data;
    let errorMessage = 'Ошибка при создании маршрута';
    
    if (serverError?.errors?.length > 0) {
      errorMessage = serverError.errors.map(e => `${e.field}: ${e.message}`).join('\n');
    } else if (serverError?.message) {
      errorMessage = serverError.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const updateRoute = async (id, data) => {
  try {
    const formattedData = { ...data };
    if (data.price) {
      formattedData.price = parseFloat(data.price.toString().replace(',', '.'));
    }
    if (data.durationDays) {
      formattedData.durationDays = parseInt(data.durationDays.toString());
    }
    if (data.countryId) {
      formattedData.countryId = parseInt(data.countryId);
    }
    if (data.isActive !== undefined) {
      formattedData.isActive = data.isActive === 'true' || data.isActive === true;
    }
    
    const response = await api.put(`/routes/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating route ${id}:`, error.response?.data || error.message);
    
    const serverError = error.response?.data;
    let errorMessage = 'Ошибка при обновлении маршрута';
    
    if (serverError?.errors?.length > 0) {
      errorMessage = serverError.errors.map(e => `${e.field}: ${e.message}`).join('\n');
    } else if (serverError?.message) {
      errorMessage = serverError.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const deleteRoute = async (id) => {
  try {
    await api.delete(`/routes/${id}`);
  } catch (error) {
    console.error(`Error deleting route ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const checkRouteExists = async (id) => {
  try {
    const response = await api.head(`/routes/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error checking route ${id}:`, error.response?.data || error.message);
    return false;
  }
};

export const checkRouteCodeExists = async (code) => {
  try {
    const routes = await getRoutes({ code });
    return routes.data && routes.data.length > 0;
  } catch (error) {
    console.error('Error checking route code:', error);
    return false;
  }
};