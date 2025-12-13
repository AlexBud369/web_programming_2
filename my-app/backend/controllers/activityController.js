const BaseController = require('./baseController');
const { Activity } = require('../models');

class ActivityController extends BaseController {
  constructor() {
    super(Activity);
    this.searchFields = ['title', 'description', 'type', 'location'];
  }
}

module.exports = new ActivityController();