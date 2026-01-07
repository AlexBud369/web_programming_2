const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const { validateIdParam, validateSale } = require('../middlewares/validation');
const { authenticate } = require('../middlewares/auth.middleware'); 

router.post('/', authenticate, validateSale, saleController.create);
router.get('/', authenticate, saleController.getAll);
router.get('/:id', authenticate, validateIdParam, saleController.getById);
router.put('/:id', authenticate, validateIdParam, validateSale, saleController.update);
router.delete('/:id', authenticate, validateIdParam, saleController.remove);
router.head('/:id', authenticate, validateIdParam, saleController.checkExists);

module.exports = router;