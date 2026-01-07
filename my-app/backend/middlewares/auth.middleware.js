const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Токен истек',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ 
      message: 'Неверный токен'
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }
    
    next();
  };
};

const checkResourceOwnership = (model) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }
      
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resource = await model.findByPk(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ message: 'Ресурс не найден' });
      }
      
      if (resource.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Доступ запрещен. Ресурс не принадлежит вам.' });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authenticate, authorize, checkResourceOwnership };