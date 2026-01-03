const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');
const { validateIdParam, validateCountry } = require('../middlewares/validation');

router.post('/', validateCountry, countryController.create);
router.get('/', countryController.getAll);
router.get('/:id', validateIdParam, countryController.getById);
router.put('/:id', validateIdParam, validateCountry, countryController.update);
router.delete('/:id', validateIdParam, countryController.remove);
router.head('/:id', validateIdParam, countryController.checkExists);

module.exports = router;