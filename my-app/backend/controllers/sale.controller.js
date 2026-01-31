const BaseController = require('./base.controller');
const saleService = require('../services/sale.service');
const { Op } = require('sequelize'); 

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

  getForExport = async (req, res, next) => {
    try {
      const filters = {};
      if (req.query.fromDate) {
        const fromDate = new Date(req.query.fromDate);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({
            message: 'Проверьте введённые данные',
            errors: [{ message: 'Неверный формат даты "с"', field: 'fromDate' }]
          });
        }
        filters.saleDate = { [Op.gte]: fromDate };
      }
      
      if (req.query.toDate) {
        const toDate = new Date(req.query.toDate);
        if (isNaN(toDate.getTime())) {
          return res.status(400).json({
            message: 'Проверьте введённые данные',
            errors: [{ message: 'Неверный формат даты "по"', field: 'toDate' }]
          });
        }
        filters.saleDate = { ...filters.saleDate, [Op.lte]: toDate };
      }

      const data = await this.service.getForExport(filters, req.user);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req, res, next) => {
    try {
      const filters = {};
      const options = {};
      
      if (req.query.fromDate) filters.fromDate = req.query.fromDate;
      if (req.query.toDate) filters.toDate = req.query.toDate;
      
      if (req.query.groupBy) options.groupBy = req.query.groupBy;
      if (req.query.distributionBy) options.distributionBy = req.query.distributionBy; 

      const stats = await this.service.getStats(filters, req.user, options);
      res.json(stats);
    } catch (error) {
      console.error('Error in getStats controller:', error);
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
  checkExists: controller.exists.bind(controller),
  getForExport: controller.getForExport.bind(controller),
  getStats: controller.getStats.bind(controller)
};