const BaseController = require('./baseController');
const { Destination, Activity } = require('../models/associations'); 

class DestinationController extends BaseController {
  constructor() {
    super(Destination);
    this.searchFields = ['name', 'location', 'notes'];
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

  getById = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id, {
        include: [{ model: Activity, as: 'activities' }]
      });
      
      if (!record) {
        return res.status(404).json({ success: false, error: 'Пункт назначения не найден' });
      }
      
      res.json({ success: true, data: record });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

module.exports = new DestinationController();