const BaseController = require('./base.controller');
const countryService = require('../services/country.service');

class CountryController extends BaseController {
  constructor() {
    super(countryService);
    this.fieldMapping = {
      ...this.fieldMapping,
      visaCost: 'visaCost',
      code: 'code',
      name: 'name'
    };
  }
}

const controller = new CountryController();

module.exports = {
  create: controller.create.bind(controller),
  getAll: controller.getAll.bind(controller),
  getById: controller.getById.bind(controller),
  update: controller.update.bind(controller),
  remove: controller.delete.bind(controller),
  checkExists: controller.exists.bind(controller)
};