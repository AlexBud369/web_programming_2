const saleRepository = require('../repositories/sale.repository');
const { Route } = require('../models');

class SaleService {
  async create(data, userId) {  
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
        createdBy: userId, 
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

  async getAll({ page, limit, sort, order, filters, search }, user) { 
    const where = { ...filters };
    
    if (user && user.role !== 'admin') {
      where.createdBy = user.id;
    }
    
    return await saleRepository.getAllWithPaginationAndFilters({
      page,
      limit,
      sort,
      order,
      filters: where,  
      search
    });
  }

  async getById(id, user) {  
    const sale = await saleRepository.findById(id);
    if (!sale) {
      const error = new Error('Продажа не найдена');
      error.statusCode = 404;
      throw error;
    }
    
    if (user && user.role !== 'admin' && sale.createdBy !== user.id) {
      const error = new Error('Доступ запрещен. Эта продажа не принадлежит вам.');
      error.statusCode = 403;
      throw error;
    }
    
    return sale;
  }

  async update(id, data, user) {  
    try {
      const sale = await this.getById(id, user);
      
      if (data.routeId) {
        const route = await Route.findByPk(data.routeId);
        if (!route) {
          const error = new Error('Маршрут с указанным ID не найден');
          error.statusCode = 404;
          throw error;
        }
      }

      const processedData = { ...data };
      
      delete processedData.createdBy;
      
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

  async delete(id, user) {  
    const sale = await this.getById(id, user);
    
    const deleted = await saleRepository.delete(id);
    if (!deleted) {
      const error = new Error('Продажа не найдена');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }

  async exists(id, user) {
    try {
      await this.getById(id, user);
      return true;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 403) {
        return false;
      }
      throw error;
    }
  }
}

module.exports = new SaleService();