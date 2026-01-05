const routeRepository = require('../repositories/route.repository');
const Country = require('../models/country.model');
const Sale = require('../models/sale.model');

class RouteService {
  async create(data) {
    try {
      const existingRoute = await routeRepository.findOneByCode(data.code);
      if (existingRoute) {
        const error = new Error(`Маршрут с кодом '${data.code}' уже существует`);
        error.statusCode = 409;
        throw error;
      }

      const country = await Country.findById(data.countryId);
      if (!country) {
        const error = new Error('Указанная страна не найдена');
        error.statusCode = 404;
        throw error;
      }

      const processedData = {
        ...data,
        durationDays: parseInt(data.durationDays),
        isActive: data.isActive === 'true' || data.isActive === true
      };

      return await routeRepository.create(processedData);
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationError = new Error('Ошибка валидации данных маршрута');
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
    return await routeRepository.getAllWithPaginationAndFilters({
      page,
      limit,
      sort,
      order,
      filters,
      search
    });
  }

  async getById(id) {
    const route = await routeRepository.findById(id);
    if (!route) {
      const error = new Error('Маршрут не найден');
      error.statusCode = 404;
      throw error;
    }
    return route;
  }

  async update(id, data) {
    try {
      if (data.code) {
        const existingRoute = await routeRepository.findOneByCode(data.code);
        if (existingRoute && existingRoute._id.toString() !== id) {
          const error = new Error(`Маршрут с кодом '${data.code}' уже существует`);
          error.statusCode = 409;
          throw error;
        }
      }

      if (data.countryId) {
        const country = await Country.findById(data.countryId);
        if (!country) {
          const error = new Error('Указанная страна не найдена');
          error.statusCode = 404;
          throw error;
        }
      }

      const processedData = { ...data };
      if (data.durationDays !== undefined) {
        processedData.durationDays = parseInt(data.durationDays);
      }
      if (data.isActive !== undefined) {
        processedData.isActive = data.isActive === 'true' || data.isActive === true;
      }

      const updated = await routeRepository.update(id, processedData);
      if (!updated) {
        const error = new Error('Маршрут не найден');
        error.statusCode = 404;
        throw error;
      }
      return updated;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationError = new Error('Ошибка валидации данных маршрута');
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
    try {
      const relatedSales = await Sale.find({ routeId: id });
      
      if (relatedSales.length > 0) {
        const error = new Error('Невозможно удалить маршрут: существуют связанные продажи');
        error.statusCode = 400;
        error.relatedSalesCount = relatedSales.length;
        throw error;
      }
      
      const deleted = await routeRepository.delete(id);
      if (!deleted) {
        const error = new Error('Маршрут не найден');
        error.statusCode = 404;
        throw error;
      }
      return deleted;
    } catch (error) {
      console.error('Error in routeService.delete:', error);
      
      if (error.statusCode) {
        throw error;
      }
      
      const serviceError = new Error('Ошибка при удалении маршрута');
      serviceError.statusCode = 500;
      serviceError.originalError = error.message;
      throw serviceError;
    }
  }

  async exists(id) {
    return await routeRepository.exists(id);
  }
}

module.exports = new RouteService();