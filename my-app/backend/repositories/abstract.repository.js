class AbstractRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findAndCountAll(options = {}) {
    return await this.model.findAndCountAll(options);
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async update(id, data) {
    const entity = await this.findById(id);
    if (!entity) return null;
    return await entity.update(data);
  }

  async delete(id) {
    const entity = await this.findById(id);
    if (!entity) return null;
    await entity.destroy();
    return true;
  }

  async exists(id) {
    return await this.model.findByPk(id) !== null;
  }
}

module.exports = AbstractRepository;