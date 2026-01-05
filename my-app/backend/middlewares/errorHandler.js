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

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Проверьте введённые данные',
      success: false,
      errors: Object.values(err.errors).map(e => ({ 
        field: e.path, 
        message: e.message 
      }))
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Объект с таким значением уже существует',
      success: false,
      errors: Object.keys(err.keyPattern).map(field => ({ 
        field: field, 
        message: `Значение должно быть уникальным` 
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

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Некорректный формат ID',
      success: false
    });
  }

  if (err.message.includes('существуют связанные') || 
      err.message.includes('невозможно удалить')) {
    return res.status(err.statusCode || 400).json({
      message: err.message,
      success: false,
      relatedCount: err.relatedRoutesCount || err.relatedSalesCount
    });
  }

  res.status(500).json({
    message: 'Ошибка на сервере. Попробуйте позже',
    success: false,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;