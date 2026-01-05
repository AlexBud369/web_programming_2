const AbstractRepository = require('./abstract.repository');
const Sale = require('../models/sale.model');

class SaleRepository extends AbstractRepository {
  constructor() {
    super(Sale);
  }

  async getAllWithPaginationAndFilters({ page = 1, limit = 10, sort = 'createdAt', order = 'ASC', filters = {}, search = '' }) {
    const query = { ...filters };
    
    if (search) {
      query.$or = [
        { purpose: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortObj = {};
    sortObj[sort] = order === 'ASC' ? 1 : -1;
    
    return await this.findAll(query, sortObj, page, limit);
  }
}

module.exports = new SaleRepository();