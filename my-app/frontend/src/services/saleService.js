import api from './api';

export const getSales = async (params) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error.response?.data || error.message);
    throw error;
  }
};

export const getSaleById = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sale ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createSale = async (data) => {
  try {
    console.log('Creating sale with data:', data);
    
    const formattedData = {
      ...data,
      price: data.price ? parseFloat(data.price.toString().replace(',', '.')) : 0,
      quantity: data.quantity ? parseInt(data.quantity.toString()) : 1,
      routeId: parseInt(data.routeId)
    };
    
    console.log('Formatted sale data:', formattedData);
    
    const response = await api.post('/sales', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating sale:', error);
    console.error('Server error response:', error.response?.data);
    
    const serverError = error.response?.data;
    let errorMessage = 'Ошибка при создании продажи';
    
    if (serverError?.errors?.length > 0) {
      errorMessage = serverError.errors.map(e => `${e.field}: ${e.message}`).join(', ');
    } else if (serverError?.message) {
      errorMessage = serverError.message;
    }
    
    if (errorMessage.includes('Маршрут с указанным ID не найден') || 
        errorMessage.includes('маршрут не найден')) {
      errorMessage = 'Выбранный маршрут не существует. Пожалуйста, выберите другой маршрут.';
    }
    
    throw new Error(errorMessage);
  }
};

export const updateSale = async (id, data) => {
  try {
    const formattedData = { ...data };
    if (data.price) {
      formattedData.price = parseFloat(data.price.toString().replace(',', '.'));
    }
    if (data.quantity) {
      formattedData.quantity = parseInt(data.quantity.toString());
    }
    if (data.routeId) {
      formattedData.routeId = parseInt(data.routeId);
    }
    
    const response = await api.put(`/sales/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sale ${id}:`, error.response?.data || error.message);
    
    const serverError = error.response?.data;
    let errorMessage = 'Ошибка при обновлении продажи';
    
    if (serverError?.errors?.length > 0) {
      errorMessage = serverError.errors.map(e => `${e.field}: ${e.message}`).join(', ');
    } else if (serverError?.message) {
      errorMessage = serverError.message;
    }
    
    throw new Error(errorMessage);
  }
};

export const deleteSale = async (id) => {
  try {
    await api.delete(`/sales/${id}`);
  } catch (error) {
    console.error(`Error deleting sale ${id}:`, error.response?.data || error.message);
    throw error;
  }
};