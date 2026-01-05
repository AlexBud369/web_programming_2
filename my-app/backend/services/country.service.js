const countryRepository = require('../repositories/country.repository');
const Route = require('../models/route.model');

class CountryService {
  async create(data) {
    return await countryRepository.create(data);
  }

  async getAll({ page, limit, sort, order, filters, search }) {
    return await countryRepository.getAllWithPaginationAndFilters({
      page,
      limit,
      sort,
      order,
      filters,
      search
    });
  }

  async getById(id) {
    const country = await countryRepository.findById(id);
    if (!country) {
      const error = new Error('Country not found');
      error.statusCode = 404;
      throw error;
    }
    return country;
  }

  async update(id, data) {
    const updated = await countryRepository.update(id, data);
    if (!updated) {
      const error = new Error('Country not found');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async delete(id) {
    try {
      const relatedRoutes = await Route.find({ countryId: id });
      
      if (relatedRoutes.length > 0) {
        const error = new Error('Невозможно удалить страну: существуют связанные маршруты');
        error.statusCode = 400;
        error.relatedRoutesCount = relatedRoutes.length;
        throw error;
      }
      
      const deleted = await countryRepository.delete(id);
      if (!deleted) {
        const error = new Error('Country not found');
        error.statusCode = 404;
        throw error;
      }
      return deleted;
    } catch (error) {
      console.error('Error in countryService.delete:', error);
      
      if (error.statusCode) {
        throw error;
      }
      
      const serviceError = new Error('Ошибка при удалении страны');
      serviceError.statusCode = 500;
      serviceError.originalError = error.message;
      throw serviceError;
    }
  }

  async exists(id) {
    return await countryRepository.exists(id);
  }
}

module.exports = new CountryService();