const { Op } = require('sequelize');
const AbstractRepository = require('./abstract.repository');
const { Route } = require('../models');

class RouteRepository extends AbstractRepository {
  constructor() {
    super(Route);
  }

  async getAllWithPaginationAndFilters({ page = 1, limit = 10, sort = 'createdAt', order = 'ASC', filters = {}, search = '' }) {
    const offset = (page - 1) * limit;
    const where = { ...filters };

    if (search) {
      where[Op.or] = Route.searchFields.map(field => ({
        [field]: { [Op.iLike]: `%${search}%` }
      }));
    }

    return await this.findAndCountAll({
      where,
      order: [[sort, order]],
      limit,
      offset
    });
  }
}

module.exports = new RouteRepository();