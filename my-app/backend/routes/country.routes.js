const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');
const { validateIdParam, validateCountry } = require('../middlewares/validation');
const { authenticate, authorize } = require('../middlewares/auth.middleware'); // ДОБАВИТЬ

router.post('/', authenticate, authorize('admin'), validateCountry, countryController.create);
router.get('/', authenticate, countryController.getAll);  // ДОБАВИТЬ authenticate
router.get('/:id', authenticate, validateIdParam, countryController.getById);  // ДОБАВИТЬ authenticate
router.put('/:id', authenticate, authorize('admin'), validateIdParam, validateCountry, countryController.update);
router.delete('/:id', authenticate, authorize('admin'), validateIdParam, countryController.remove);
router.head('/:id', authenticate, validateIdParam, countryController.checkExists);  // ДОБАВИТЬ authenticate

module.exports = router;