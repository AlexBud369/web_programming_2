const BaseController = require('./base.controller');
const routeService = require('../services/route.service');

class RouteController extends BaseController {
  constructor() {
    super(routeService);
    this.fieldMapping = {
      ...this.fieldMapping,
      code: 'code',
      name: 'name',
      durationDays: 'durationDays',
      price: 'price',
      isActive: 'isActive',
      countryId: 'countryId'
    };
  }
}

const controller = new RouteController();

module.exports = {
  create: controller.create.bind(controller),
  getAll: controller.getAll.bind(controller),
  getById: controller.getById.bind(controller),
  update: controller.update.bind(controller),
  remove: controller.delete.bind(controller),
  checkExists: controller.exists.bind(controller)
};