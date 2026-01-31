import api from './api';

const exportService = {
  getSalesForExport: async (params = {}) => {
    try {
      const response = await api.get('/sales/export', { params });
      return response.data;
    } catch (error) {
      throw new Error('Ошибка получения данных для экспорта: ' + error.message);
    }
  },

  getSalesStats: async (params = {}) => {
    try {
      const response = await api.get('/sales/stats', { params });
      return response.data;
    } catch (error) {
      throw new Error('Ошибка получения статистики: ' + error.message);
    }
  }
};

export default exportService;