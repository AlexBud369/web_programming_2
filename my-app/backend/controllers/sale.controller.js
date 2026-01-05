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