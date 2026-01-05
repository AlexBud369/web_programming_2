const saleRepository = require('../repositories/sale.repository');
const Route = require('../models/route.model');

class SaleService {
  async create(data) {
    try {
      const route = await Route.findById(data.routeId);
      if (!route) {
        const error = new Error('Маршрут с указанным ID не найден');
        error.statusCode = 404;
        throw error;
      }

      const processedData = {
        ...data,
        quantity: parseInt(data.quantity)
      };

      return await saleRepository.create(processedData);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationError = new Error('Ошибка валидации данных продажи');
        validationError.errors = Object.values(error.errors).map(e => ({
          field: e.path,
          message: e.message
        }));
        validationError.statusCode = 400;
        throw validationError;
      }
      throw error;
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
        const route = await Route.findById(data.routeId);
        if (!route) {
          const error = new Error('Маршрут с указанным ID не найден');
          error.statusCode = 404;
          throw error;
        }
      }

      const processedData = { ...data };
      if (data.quantity !== undefined) {
        processedData.quantity = parseInt(data.quantity);
      }

      const updated = await saleRepository.update(id, processedData);
      if (!updated) {
        const error = new Error('Продажа не найдена');
        error.statusCode = 404;
        throw error;
      }
      return updated;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationError = new Error('Ошибка валидации данных продажи');
        validationError.errors = Object.values(error.errors).map(e => ({
          field: e.path,
          message: e.message
        }));
        validationError.statusCode = 400;
        throw validationError;
      }
      throw error;
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