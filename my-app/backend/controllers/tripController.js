const BaseController = require('./baseController');
const { Trip, Destination, Activity } = require('../models/associations');

class TripController extends BaseController {
  constructor() {
    super(Trip);
    this.searchFields = ['title', 'description', 'status'];
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
        include: [
          { 
            model: Destination, 
            as: 'destinations',
            include: [{ model: Activity, as: 'activities' }]
          }
        ]
      });
      
      if (!record) {
        return res.status(404).json({ success: false, error: 'Путешествие не найдено' });
      }
      
      res.json({ success: true, data: record });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getStatistics = async (req, res) => {
    try {
      const totalTrips = await this.model.count();
      const activeTrips = await this.model.count({ where: { status: 'active' } });
      const totalBudget = await this.model.sum('total_budget');
      
      res.json({
        success: true,
        data: {
          totalTrips,
          activeTrips,
          totalBudget: totalBudget || 0
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

module.exports = new TripController();