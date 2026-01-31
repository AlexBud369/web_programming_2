const routeRepository = require('../repositories/route.repository');
const { Op } = require('sequelize');
const { Route, Country } = require('../models');

class RouteService {
    async create(data) {
      try {
        console.log('RouteService.create received:', data);
        
        const existingRoute = await Route.findOne({
          where: { code: data.code }
        });
        
        if (existingRoute) {
          const error = new Error(`Маршрут с кодом '${data.code}' уже существует`);
          error.statusCode = 409;
          throw error;
        }

        const country = await Country.findByPk(data.countryId);
        if (!country) {
          const error = new Error('Указанная страна не найдена');
          error.statusCode = 404;
          throw error;
        }

        const processedData = {
          ...data,
          durationDays: parseInt(data.durationDays),
          countryId: parseInt(data.countryId),
          isActive: data.isActive === 'true' || data.isActive === true,
          startSeasonDate: data.startSeasonDate ? new Date(data.startSeasonDate) : null,
          endSeasonDate: data.endSeasonDate ? new Date(data.endSeasonDate) : null
        };

        console.log('Processed route data:', processedData);
        
        const testRoute = Route.build(processedData);
        await testRoute.validate();
        
        return await routeRepository.create(processedData);
      } catch (err) {
        console.log('Create route error:', err.message);
        
        if (err.name === 'SequelizeValidationError') {
          const validationError = new Error('Ошибка валидации данных маршрута');
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
    if (!route) throw new Error('Маршрут не найден');
    return route;
  }

  async update(id, data) {
    try {
      if (data.code) {
        const existingRoute = await Route.findOne({
          where: { 
            code: data.code,
            id: { [Op.ne]: id }
          }
        });
        
        if (existingRoute) {
          throw new Error(`Маршрут с кодом '${data.code}' уже существует`);
        }
      }

      if (data.countryId) {
        const country = await Country.findByPk(data.countryId);
        if (!country) throw new Error('Указанная страна не найдена');
      }

      const processedData = { ...data };
      if (data.price !== undefined) {
        processedData.price = typeof data.price === 'string' 
          ? parseFloat(data.price.replace(',', '.')) 
          : data.price;
      }
      if (data.durationDays !== undefined) {
        processedData.durationDays = typeof data.durationDays === 'string'
          ? parseInt(data.durationDays)
          : data.durationDays;
      }
      if (data.countryId !== undefined) {
        processedData.countryId = parseInt(data.countryId);
      }
      if (data.isActive !== undefined) {
        processedData.isActive = data.isActive === 'true' || data.isActive === true;
      }
      if (data.startSeasonDate !== undefined) {
        processedData.startSeasonDate = data.startSeasonDate ? new Date(data.startSeasonDate) : null;
      }
      if (data.endSeasonDate !== undefined) {
        processedData.endSeasonDate = data.endSeasonDate ? new Date(data.endSeasonDate) : null;
      }

      const updated = await routeRepository.update(id, processedData);
      if (!updated) throw new Error('Маршрут не найден');
      return updated;
    } catch (err) {
      console.log('Update route error:', err.message);
      throw err;
    }
  }

  async delete(id) {
    const deleted = await routeRepository.delete(id);
    if (!deleted) throw new Error('Маршрут не найден');
    return deleted;
  }

  async exists(id) {
    return await routeRepository.exists(id);
  }
}

module.exports = new RouteService();