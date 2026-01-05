class BaseController {
  constructor(service, entityName = 'Entity') {
    this.service = service;
    this.entityName = entityName;
    this.fieldMapping = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      id: 'id'
    };
  }

  getAll = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || 'createdAt';
      const order = req.query.order?.toUpperCase() || 'ASC';
      const search = req.query.search || '';

      const filters = {};
      Object.keys(req.query).forEach(key => {
        if (!['page', 'limit', 'sort', 'order', 'search'].includes(key) && req.query[key] !== '') {
          const mappedKey = this.fieldMapping[key] || key;
          filters[mappedKey] = req.query[key];
        }
      });

      const result = await this.service.getAll({ page, limit, sort, order, filters, search });

      res.json({
        data: result.rows,
        total: result.count,
        page,
        limit
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const record = await this.service.getById(req.params.id);
      res.json(record);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const record = await this.service.create(req.body);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const record = await this.service.update(req.params.id, req.body);
      res.json(record);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  exists = async (req, res, next) => {
    try {
      const exists = await this.service.exists(req.params.id);
      res.json({ exists });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = BaseController;