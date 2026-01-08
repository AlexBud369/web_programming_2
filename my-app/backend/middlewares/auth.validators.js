const { body } = require('express-validator');
const { validate } = require('./validation');

const validateRegister = [
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
  
  validate
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Недопустимый формат email')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Пароль обязателен'),
  
  validate
];

const validatePasswordReset = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Недопустимый формат email')
    .normalizeEmail(),
  
  validate
];

const validateChangePassword = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Текущий пароль обязателен'),
  
  body('newPassword')
    .trim()
    .notEmpty().withMessage('Новый пароль обязателен')
    .isLength({ min: 6 }).withMessage('Новый пароль должен быть не менее 6 символов'),
  
  validate
];

const validateResetPassword = [
  body('token')
    .trim()
    .notEmpty().withMessage('Токен обязателен'),
  
  body('newPassword')
    .trim()
    .notEmpty().withMessage('Новый пароль обязателен')
    .isLength({ min: 6 }).withMessage('Новый пароль должен быть не менее 6 символов'),
  
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordReset,
  validateResetPassword, 
  validateChangePassword
};