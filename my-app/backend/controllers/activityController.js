const BaseController = require('./baseController');
const { Activity } = require('../models/associations');

class ActivityController extends BaseController {
  constructor() {
    super(Activity);
    this.searchFields = ['title', 'description', 'type', 'location'];
    this.fieldMapping = {
        'createdAt': 'createdAt',
        'updatedAt': 'updatedAt',
        'created_at': 'createdAt',
        'updated_at': 'updatedAt',
        'startDate': 'start_date',
        'endDate': 'end_date',
        'total_budget': 'total_budget'
    };
  }
}

module.exports = new ActivityController();