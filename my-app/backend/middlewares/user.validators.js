const { body, param } = require('express-validator');
const { validate } = require('./validation');

const validateUserCreate = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Недопустимый формат email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Пароль обязателен')
    .isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  
  body('firstName')
    .trim()
    .notEmpty().withMessage('Имя обязательно')
    .isLength({ min: 2, max: 50 }).withMessage('Имя должно быть от 2 до 50 символов'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Фамилия обязательна')
    .isLength({ min: 2, max: 50 }).withMessage('Фамилия должна быть от 2 до 50 символов'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Недопустимая роль'),
  
  validate
];

const validateUserUpdate = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Недопустимый формат email')
    .normalizeEmail(),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Имя должно быть от 2 до 50 символов'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Фамилия должна быть от 2 до 50 символов'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Недопустимая роль'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive должен быть boolean'),
  
  validate
];

const validateRoleChange = [
  body('role')
    .isIn(['user', 'admin']).withMessage('Недопустимая роль'),
  validate
];

const validateBulkUpdate = [
  body('updates')
    .isArray().withMessage('updates должен быть массивом')
    .notEmpty().withMessage('Массив updates не должен быть пустым'),
  
  body('updates.*.id')
    .isInt({ min: 1 }).withMessage('ID пользователя должен быть положительным целым числом'),
  
  body('updates.*.role')
    .isIn(['user', 'admin']).withMessage('Недопустимая роль'),
  
  validate
];

const validateIdParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID должен быть положительным целым числом'),
  validate
];

module.exports = {
  validateUserCreate,
  validateUserUpdate,
  validateRoleChange,
  validateBulkUpdate,
  validateIdParam
};