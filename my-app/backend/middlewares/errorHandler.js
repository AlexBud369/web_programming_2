const errorHandler = (err, req, res, next) => {
  console.error('Error handler caught:', err.message);
  console.error(err.stack);

  if (err.message.includes('уже существует') || err.message.toLowerCase().includes('already exists')) {
    return res.status(409).json({
      message: err.message,
      success: false
    });
  }

  if (err.message.includes('не найден') || err.message.includes('не найдена') ||
      err.message.toLowerCase().includes('not found')) {
    return res.status(404).json({
      message: err.message,
      success: false
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Проверьте введённые данные',
      success: false,
      errors: err.errors.map(e => ({ 
        field: e.path, 
        message: e.message 
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Объект с таким значением уже существует',
      success: false,
      errors: err.errors.map(e => ({ 
        field: e.path, 
        message: e.message 
      }))
    });
  }

  if (err.errors && Array.isArray(err.errors) && 
      (err.message.includes('Ошибка валидации данных') || 
       err.message.includes('validation') ||
       err.message.includes('валидации'))) {
    return res.status(400).json({
      message: err.message,
      success: false,
      errors: err.errors
    });
  }

  res.status(500).json({
    message: 'Ошибка на сервере. Попробуйте позже',
    success: false,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;