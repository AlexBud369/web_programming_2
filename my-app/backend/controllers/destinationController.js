const BaseController = require('./baseController');
const { Destination, Activity } = require('../models');

class DestinationController extends BaseController {
  constructor() {
    super(Destination);
    this.searchFields = ['name', 'location', 'notes'];
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