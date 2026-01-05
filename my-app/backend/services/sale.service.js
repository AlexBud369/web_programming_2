const saleRepository = require('../repositories/sale.repository');
const { Route } = require('../models');

class SaleService {
  async create(data) {
    try {
      console.log('SaleService.create received:', data);
      
      const route = await Route.findByPk(data.routeId);
      if (!route) {
        const error = new Error('Маршрут с указанным ID не найден');
        error.statusCode = 404;
        throw error;
      }

      const processedData = {
        ...data,
        price: typeof data.price === 'string' 
          ? parseFloat(data.price.replace(',', '.')) 
          : data.price,
        quantity: typeof data.quantity === 'string' 
          ? parseInt(data.quantity) 
          : data.quantity,
        routeId: parseInt(data.routeId),
      };

      console.log('Processed sale data:', processedData);
      
      return await saleRepository.create(processedData);
    } catch (err) {
      console.log('Create sale error:', err);
      console.log('Error name:', err.name);
      console.log('Error details:', err.errors || err);
      
      if (err.name === 'SequelizeValidationError') {
        const validationError = new Error('Ошибка валидации данных продажи');
        validationError.errors = err.errors.map(e => ({
          field: e.path,
          message: e.message
        }));
        validationError.statusCode = 400;
        throw validationError;
      }
      
      if (err.statusCode) {
        err.statusCode = err.statusCode;
      }
      
      throw err;
    }
  }

  async getAll({ page, limit, sort, order, filters, search }) {
    return await saleRepository.getAllWithPaginationAndFilters({
      page,
      limit,
      sort,
      order,
      filters,
      search
    });
  }

  async getById(id) {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      const error = new Error('Продажа не найдена');
      error.statusCode = 404;
      throw error;
    }
    return sale;
  }

  async update(id, data) {
    try {
      if (data.routeId) {
        const route = await Route.findByPk(data.routeId);
        if (!route) {
          const error = new Error('Маршрут с указанным ID не найден');
          error.statusCode = 404;
          throw error;
        }
      }

      const processedData = { ...data };
      if (data.price !== undefined) {
        processedData.price = typeof data.price === 'string' 
          ? parseFloat(data.price.replace(',', '.')) 
          : data.price;
      }
      if (data.quantity !== undefined) {
        processedData.quantity = typeof data.quantity === 'string'
          ? parseInt(data.quantity)
          : data.quantity;
      }
      if (data.routeId !== undefined) {
        processedData.routeId = parseInt(data.routeId);
      }

      const updated = await saleRepository.update(id, processedData);
      if (!updated) {
        const error = new Error('Продажа не найдена');
        error.statusCode = 404;
        throw error;
      }
      return updated;
    } catch (err) {
      console.log('Update sale error:', err.message);
      
      if (err.name === 'SequelizeValidationError') {
        const validationError = new Error('Ошибка валидации данных продажи');
        validationError.errors = err.errors.map(e => ({
          field: e.path,
          message: e.message
        }));
        validationError.statusCode = 400;
        throw validationError;
      }
      
      throw err;
    }
  }

  async delete(id) {
    const deleted = await saleRepository.delete(id);
    if (!deleted) {
      const error = new Error('Продажа не найдена');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }

  async exists(id) {
    return await saleRepository.exists(id);
  }
}

module.exports = new SaleService();