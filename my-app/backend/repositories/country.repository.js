const { Op } = require('sequelize');
const AbstractRepository = require('./abstract.repository');
const { Country } = require('../models');

class CountryRepository extends AbstractRepository {
  constructor() {
    super(Country);
  }

  async getAllWithPaginationAndFilters({ page = 1, limit = 10, sort = 'createdAt', order = 'ASC', filters = {}, search = '' }) {
    const offset = (page - 1) * limit;
    const where = { ...filters };

    if (search) {
      where[Op.or] = Country.searchFields.map(field => ({
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

module.exports = new CountryRepository();