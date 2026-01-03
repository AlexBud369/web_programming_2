const countryRepository = require('../repositories/country.repository');

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
    if (!country) throw new Error('Country not found');
    return country;
  }

  async update(id, data) {
    const updated = await countryRepository.update(id, data);
    if (!updated) throw new Error('Country not found');
    return updated;
  }

  async delete(id) {
    const deleted = await countryRepository.delete(id);
    if (!deleted) throw new Error('Country not found');
    return deleted;
  }

  async exists(id) {
    return await countryRepository.exists(id);
  }
}

module.exports = new CountryService();