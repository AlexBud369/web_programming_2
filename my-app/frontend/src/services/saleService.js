import api from './api';

const normalizeItem = (item) => ({
  ...item,
  id: item.id || item._id
});

export const getSales = async (params) => {
  try {
    const response = await api.get('/sales', { params });
    const normalizedData = {
      ...response.data,
      data: response.data.data?.map(normalizeItem) || []
    };
    return normalizedData;
  } catch (error) {
    console.error('Error fetching sales:', error.response?.data || error.message);
    throw error;
  }
};

export const getSaleById = async (id) => {
  try {
    const response = await api.get(`/sales/${id}`);
    return normalizeItem(response.data);
  } catch (error) {
    console.error(`Error fetching sale ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createSale = async (data) => {
  try {
    const formattedData = {
      ...data,
      price: data.price ? parseFloat(data.price.toString().replace(',', '.')) : 0,
      quantity: data.quantity ? parseInt(data.quantity.toString()) : 1
    };
    
    const response = await api.post('/sales', formattedData);
    return normalizeItem(response.data);
  } catch (error) {
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
    
    const response = await api.put(`/sales/${id}`, formattedData);
    return normalizeItem(response.data);
  } catch (error) {
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