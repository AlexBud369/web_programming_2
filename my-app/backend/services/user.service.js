const userRepository = require('../repositories/user.repository');

class UserService {
  async getAll({ page = 1, limit = 10, sort = 'createdAt', order = 'DESC', filters = {}, search = '' }) {
    const offset = (page - 1) * limit;
    
    const options = {
      limit,
      offset,
      order: [[sort, order]]
    };

    if (Object.keys(filters).length > 0) {
      options.where = filters;
    }

    if (search) {
      return await userRepository.searchUsers(search, options);
    }

    return await userRepository.findAndCountAll(options);
  }

  async getById(id) {
    return await userRepository.findById(id);
  }

  async create(data) {
    const existingUser = await userRepository.model.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    const user = await userRepository.model.create(data);
    const userData = user.toJSON();
    delete userData.password;
    return userData;
  }

  async update(id, data) {
    if (data.email) {
      const existingUser = await userRepository.model.findOne({ 
        where: { 
          email: data.email,
          id: { [userRepository.model.sequelize.Op.ne]: id }
        }
      });
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
    }

    return await userRepository.update(id, data);
  }

  async delete(id, currentUserId) {
    if (id === currentUserId) {
      throw new Error('Нельзя деактивировать свой аккаунт');
    }
    
    return await userRepository.deactivate(id);
  }

  async exists(id) {
    return await userRepository.exists(id);
  }

  async changeRole(id, role, currentUserId) {
    if (id === currentUserId) {
      throw new Error('Нельзя изменить свою роль');
    }
    
    if (!['user', 'admin'].includes(role)) {
      throw new Error('Недопустимая роль');
    }
    
    return await userRepository.changeRole(id, role);
  }

  async bulkUpdateRoles(updates, currentUserId) {
    if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error('Нет данных для обновления');
    }
    
    const selfUpdate = updates.find(update => update.id === currentUserId);
    if (selfUpdate) {
        throw new Error('Нельзя изменить свою роль');
    }
    
    const validRoles = ['user', 'admin'];
    const invalidUpdate = updates.find(update => !validRoles.includes(update.role));
    if (invalidUpdate) {
        throw new Error(`Недопустимая роль: ${invalidUpdate.role}`);
    }
    
    const userIds = updates.map(u => u.id);
    const users = await userRepository.model.findAll({ 
        where: { id: userIds }
    });
    
    if (users.length !== updates.length) {
        throw new Error('Некоторые пользователи не найдены');
    }
    
    return await userRepository.bulkUpdateRoles(updates);
  }

  async getUsersByRole(role) {
    return await userRepository.findByRole(role);
  }

  async search(searchTerm) {
    return await userRepository.searchUsers(searchTerm);
  }
}

module.exports = new UserService();