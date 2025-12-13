const BaseController = require('./baseController');
const { User } = require('../models/associations');

class UserController extends BaseController {
  constructor() {
    super(User); 
    this.searchFields = ['name', 'email'];
  }

  create = async (req, res) => {
    try {
      const record = await this.model.create(req.body);
      res.status(201).json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  getByEmail = async (req, res) => {
    try {
      const user = await this.model.findOne({ where: { email: req.params.email } });
      if (!user) {
        return res.status(404).json({ success: false, error: 'Пользователь не найден' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

module.exports = new UserController(); 