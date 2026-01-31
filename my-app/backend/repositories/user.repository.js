const AbstractRepository = require('./abstract.repository');
const { User } = require('../models');

class UserRepository extends AbstractRepository {
  constructor() {
    super(User);
  }

  async findAll(options = {}) {
    const defaultOptions = {
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      ...options
    };
    return await super.findAll(defaultOptions);
  }

  async findAndCountAll(options = {}) {
    const defaultOptions = {
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      ...options
    };
    return await super.findAndCountAll(defaultOptions);
  }

  async findById(id) {
    const user = await super.findById(id);
    if (user) {
      const userData = user.toJSON();
      delete userData.password;
      return userData;
    }
    return null;
  }

  async findByEmail(email) {
    return await this.model.findOne({ 
      where: { email },
      attributes: { exclude: ['password'] }
    });
  }

  async findActiveUsers(options = {}) {
    return await this.findAll({
      where: { isActive: true },
      ...options
    });
  }

  async findByRole(role, options = {}) {
    return await this.findAll({
      where: { role },
      ...options
    });
  }

  async searchUsers(searchTerm, options = {}) {
    const { Op } = require('sequelize');
    return await this.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: `%${searchTerm}%` } },
          { firstName: { [Op.iLike]: `%${searchTerm}%` } },
          { lastName: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      },
      ...options
    });
  }

  async deactivate(id) {
    const user = await this.findById(id);
    if (!user) return null;
        return await this.update(id, { isActive: false });
    }

  async update(id, data) {
    if (data.password) {
      delete data.password;
    }
    const result = await super.update(id, data);
    if (result) {
      const userData = result.toJSON();
      delete userData.password;
      return userData;
    }
    return null;
  }

  async changeRole(id, role) {
    return await this.update(id, { role });
  }

 async bulkUpdateRoles(updates) {
    try {
        const results = [];
        
        for (const update of updates) {
            const user = await this.model.findByPk(update.id);
            if (!user) {
                console.warn(`Пользователь с ID ${update.id} не найден`);
                continue;
            }
            
            await user.update({ 
                role: update.role 
            });
            
            const userData = user.toJSON();
            delete userData.password;
            results.push(userData);
        }
        
        return results;
    } catch (error) {
        console.error('Ошибка при массовом обновлении ролей:', error);
        throw new Error('Ошибка обновления ролей: ' + error.message);
    }
    }
}

module.exports = new UserRepository();