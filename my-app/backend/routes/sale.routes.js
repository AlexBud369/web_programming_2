const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const { validateIdParam, validateSale } = require('../middlewares/validation');

router.post('/', validateSale, saleController.create);
router.get('/', saleController.getAll);
router.get('/:id', validateIdParam, saleController.getById);
router.put('/:id', validateIdParam, validateSale, saleController.update);
router.delete('/:id', validateIdParam, saleController.remove);
router.head('/:id', validateIdParam, saleController.checkExists);

module.exports = router;