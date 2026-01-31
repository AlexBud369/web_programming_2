const BaseController = require('./base.controller');
const userService = require('../services/user.service');

class UserController extends BaseController {
  constructor() {
    super(userService, 'Пользователь');
    this.fieldMapping = {
      ...this.fieldMapping,
      email: 'email',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      isActive: 'isActive',
      lastLogin: 'lastLogin'
    };
  }

  changeRole = async (req, res, next) => {
    try {
      const { role } = req.body;
      const { id } = req.params;
      const currentUserId = req.user.id;
      
      const updatedUser = await this.service.changeRole(id, role, currentUserId);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  bulkUpdateRoles = async (req, res, next) => {
    try {
        const { updates } = req.body;
        const currentUserId = req.user.id;

        if (!Array.isArray(updates)) {
        return res.status(400).json({ 
            success: false,
            message: 'updates должен быть массивом' 
        });
        }
        
        if (updates.length === 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Массив updates не должен быть пустым' 
        });
        }
        
        const results = await this.service.bulkUpdateRoles(updates, currentUserId);
        
        res.json({ 
        success: true,
        updatedUsers: results 
        });
        
    } catch (error) {
        console.error('Error in bulkUpdateRoles controller:', error.message);
        res.status(400).json({
        success: false,
        message: error.message || 'Ошибка при обновлении ролей',
        timestamp: new Date().toISOString()
        });
    }
};

  delete = async (req, res, next) => {
    try {
      const currentUserId = req.user.id;
      await this.service.delete(req.params.id, currentUserId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

const controller = new UserController();

module.exports = {
  getAll: controller.getAll.bind(controller),
  getById: controller.getById.bind(controller),
  create: controller.create.bind(controller),
  update: controller.update.bind(controller),
  delete: controller.delete.bind(controller),
  exists: controller.exists.bind(controller),
  changeRole: controller.changeRole.bind(controller),
  bulkUpdateRoles: controller.bulkUpdateRoles.bind(controller)
};