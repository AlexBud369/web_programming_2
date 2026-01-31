const { Op } = require('sequelize');
const AbstractRepository = require('./abstract.repository');
const { Sale } = require('../models');

class SaleRepository extends AbstractRepository {
  constructor() {
    super(Sale);
  }

  async getAllWithPaginationAndFilters({ page = 1, limit = 10, sort = 'createdAt', order = 'ASC', filters = {}, search = '' }) {
    const offset = (page - 1) * limit;
    const where = { ...filters };

    if (search) {
      where[Op.or] = Sale.searchFields.map(field => ({
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

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }


  async sum(field, options = {}) {
    return await this.model.sum(field, options);
  }
}

module.exports = new SaleRepository();