const AbstractRepository = require('./abstract.repository');
const Country = require('../models/country.model');

class CountryRepository extends AbstractRepository {
  constructor() {
    super(Country);
  }

  async getAllWithPaginationAndFilters({ page = 1, limit = 10, sort = 'createdAt', order = 'ASC', filters = {}, search = '' }) {
    const query = { ...filters };
    
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortObj = {};
    sortObj[sort] = order === 'ASC' ? 1 : -1;
    
    return await this.findAll(query, sortObj, page, limit);
  }
}

module.exports = new CountryRepository();