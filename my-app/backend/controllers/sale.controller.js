const BaseController = require('./base.controller');
const saleService = require('../services/sale.service');

class SaleController extends BaseController {
  constructor() {
    super(saleService);
    this.fieldMapping = {
      ...this.fieldMapping,
      purpose: 'purpose',
      price: 'price',
      quantity: 'quantity',
      saleDate: 'saleDate',
      customerName: 'customerName',
      customerEmail: 'customerEmail',
      status: 'status',
      routeId: 'routeId'
    };
  }
  
  create = async (req, res, next) => {
    try {
      const userId = req.user.id; 
      const record = await this.service.create(req.body, userId);
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  };

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

      const result = await this.service.getAll({ 
        page, limit, sort, order, filters, search 
      }, req.user);

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
      const record = await this.service.getById(req.params.id, req.user);
      res.json(record);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const record = await this.service.update(req.params.id, req.body, req.user);
      res.json(record);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.service.delete(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  exists = async (req, res, next) => {
    try {
      const exists = await this.service.exists(req.params.id, req.user);
      res.json({ exists });
    } catch (error) {
      next(error);
    }
  };
}

const controller = new SaleController();

module.exports = {
  create: controller.create.bind(controller),
  getAll: controller.getAll.bind(controller),
  getById: controller.getById.bind(controller),
  update: controller.update.bind(controller),
  remove: controller.delete.bind(controller),
  checkExists: controller.exists.bind(controller)
};