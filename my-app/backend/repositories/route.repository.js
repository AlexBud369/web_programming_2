const AbstractRepository = require('./abstract.repository');
const Route = require('../models/route.model');

class RouteRepository extends AbstractRepository {
  constructor() {
    super(Route);
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

  async findOneByCode(code) {
    return await this.model.findOne({ code });
  }

  async findByCountryId(countryId) {
    return await this.model.find({ countryId });
  }
}

module.exports = new RouteRepository();