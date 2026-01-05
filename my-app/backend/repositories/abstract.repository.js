class AbstractRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findAll(query = {}, sort = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.model.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query)
    ]);
    
    return {
      rows: data,
      count: total
    };
  }

  async update(id, data) {
    const options = { new: true, runValidators: true };
    return await this.model.findByIdAndUpdate(id, data, options);
  }

  async delete(id) {
    const deleted = await this.model.findByIdAndDelete(id);
    return deleted !== null;
  }

  async exists(id) {
    const count = await this.model.countDocuments({ _id: id });
    return count > 0;
  }
}

module.exports = AbstractRepository;