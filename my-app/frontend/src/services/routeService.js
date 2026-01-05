import api from './api';

const normalizeItem = (item) => ({
  ...item,
  id: item.id || item._id
});

export const getRoutes = async (params) => {
  try {
    const response = await api.get('/routes', { params });
    const normalizedData = {
      ...response.data,
      data: response.data.data?.map(normalizeItem) || []
    };
    return normalizedData;
  } catch (error) {
    console.error('Error fetching routes:', error.response?.data || error.message);
    throw error;
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await api.get(`/routes/${id}`);
    return normalizeItem(response.data);
  } catch (error) {
    console.error(`Error fetching route ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createRoute = async (data) => {
  try {
    const formattedData = {
      ...data,
      price: data.price ? parseFloat(data.price.toString().replace(',', '.')) : 0,
      durationDays: data.durationDays ? parseInt(data.durationDays.toString()) : 1,
      isActive: data.isActive === 'true' || data.isActive === true
    };
    
    const response = await api.post('/routes', formattedData);
    return normalizeItem(response.data);
  } catch (error) {
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
    if (data.isActive !== undefined) {
      formattedData.isActive = data.isActive === 'true' || data.isActive === true;
    }
    
    const response = await api.put(`/routes/${id}`, formattedData);
    return normalizeItem(response.data);
  } catch (error) {
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
    
    const backendMessage = error.response?.data?.message || 'Ошибка при удалении маршрута';
    
    const cleanError = new Error(backendMessage);
    cleanError.status = error.response?.status;
    cleanError.data = error.response?.data;
    
    throw cleanError;
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