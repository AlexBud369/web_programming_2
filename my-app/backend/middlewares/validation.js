const { validationResult, body, param } = require('express-validator');

const COUNTRY_CODE_MIN_LEN = 2;
const COUNTRY_CODE_MAX_LEN = 10;
const COUNTRY_NAME_MAX_LEN = 100;
const DESCRIPTION_MAX_LEN = 5000;
const ROUTE_CODE_MAX_LEN = 20;
const ROUTE_NAME_MIN_LEN = 3;
const ROUTE_NAME_MAX_LEN = 200;
const ROUTE_DESCRIPTION_MAX_LEN = 10000;
const CUSTOMER_NAME_MAX_LEN = 200;
const CUSTOMER_EMAIL_MAX_LEN = 100;

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Проверьте введённые данные',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

const validateIdParam = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID должен быть положительным целым числом'),
  validate
];

const validateCountry = [
  body('code')
    .trim()
    .notEmpty().withMessage('Код страны обязателен')
    .isLength({ min: COUNTRY_CODE_MIN_LEN, max: COUNTRY_CODE_MAX_LEN })
    .withMessage(`Код должен быть от ${COUNTRY_CODE_MIN_LEN} до ${COUNTRY_CODE_MAX_LEN} символов`),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Название страны обязательно')
    .isLength({ max: COUNTRY_NAME_MAX_LEN })
    .withMessage(`Название не должно превышать ${COUNTRY_NAME_MAX_LEN} символов`),
  
  body('visaCost')
    .optional()
    .isFloat({ min: 0 }).withMessage('Стоимость визы должна быть не отрицательной')
    .toFloat(),
  
  body('description')
    .optional()
    .isLength({ max: DESCRIPTION_MAX_LEN })
    .withMessage(`Описание слишком длинное (максимум ${DESCRIPTION_MAX_LEN} символов)`),
  
  body('flagImage')
    .optional()
    .isURL().withMessage('URL флага должен быть действительным'),
  
  validate
];

const validateRoute = [
  body('code')
    .trim()
    .notEmpty().withMessage('Код маршрута обязателен')
    .isLength({ max: ROUTE_CODE_MAX_LEN })
    .withMessage(`Код не должен превышать ${ROUTE_CODE_MAX_LEN} символов`),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Название маршрута обязательно')
    .isLength({ min: ROUTE_NAME_MIN_LEN, max: ROUTE_NAME_MAX_LEN })
    .withMessage(`Название должно быть от ${ROUTE_NAME_MIN_LEN} до ${ROUTE_NAME_MAX_LEN} символов`),
  
  body('description')
    .optional()
    .isLength({ max: ROUTE_DESCRIPTION_MAX_LEN })
    .withMessage(`Описание слишком длинное (максимум ${ROUTE_DESCRIPTION_MAX_LEN} символов)`),
  
  body('durationDays')
    .notEmpty().withMessage('Продолжительность обязательна')
    .isInt({ min: 1 }).withMessage('Продолжительность должна быть не меньше 1 дня')
    .toInt(),
  
  body('price')
    .notEmpty().withMessage('Цена обязательна')
    .isFloat({ min: 0 }).withMessage('Цена должна быть не отрицательной')
    .toFloat(),
  
  body('imageUrl')
    .optional()
    .isURL().withMessage('URL изображения должен быть действительным'),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('Активность должна быть булевым значением')
    .toBoolean(),
  
  body('countryId')
    .notEmpty().withMessage('ID страны обязателен')
    .isInt({ min: 1 }).withMessage('ID страны должен быть положительным целым числом')
    .toInt(),
  
  validate
];

const validateSale = [
  body('purpose')
    .trim()
    .notEmpty().withMessage('Цель поездки обязательна')
    .isIn(['отдых', 'экскурсия', 'лечение', 'шоп-тур', 'обучение', 'деловая'])
    .withMessage('Недопустимая цель поездки'),
  
  body('price')
    .notEmpty().withMessage('Цена обязательна')
    .isFloat({ min: 0 }).withMessage('Цена должна быть не отрицательной')
    .toFloat(),
  
  body('quantity')
    .notEmpty().withMessage('Количество обязательно')
    .isInt({ min: 1 }).withMessage('Количество должно быть не меньше 1')
    .toInt(),
  
  body('saleDate')
    .optional()
    .isISO8601().withMessage('Дата должна быть в формате ISO')
    .toDate(),
  
  body('customerName')
    .trim()
    .notEmpty().withMessage('Имя клиента обязательно')
    .isLength({ max: CUSTOMER_NAME_MAX_LEN })
    .withMessage(`Имя не должно превышать ${CUSTOMER_NAME_MAX_LEN} символов`),
  
  body('customerEmail')
    .trim()
    .notEmpty().withMessage('Email клиента обязателен')
    .isEmail().withMessage('Недопустимый формат email')
    .normalizeEmail(),
  
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Недопустимый статус'),
  
  body('routeId')
    .notEmpty().withMessage('ID маршрута обязателен')
    .isInt({ min: 1 }).withMessage('ID маршрута должен быть положительным целым числом')
    .toInt(),
  
  validate
];

module.exports = {
  validateCountry,
  validateRoute,
  validateSale,
  validateIdParam,
  validate
};