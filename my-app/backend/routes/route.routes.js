const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');
const { validateRoute, validateIdParam } = require('../middlewares/validation');
const { authenticate, authorize } = require('../middlewares/auth.middleware'); // ДОБАВИТЬ

router.post('/', authenticate, authorize('admin'), validateRoute, routeController.create);
router.get('/', authenticate, routeController.getAll);  // ДОБАВИТЬ authenticate
router.get('/:id', authenticate, validateIdParam, routeController.getById);  // ДОБАВИТЬ authenticate
router.put('/:id', authenticate, authorize('admin'), validateIdParam, validateRoute, routeController.update);
router.delete('/:id', authenticate, authorize('admin'), validateIdParam, routeController.remove);
router.head('/:id', authenticate, validateIdParam, routeController.checkExists);  // ДОБАВИТЬ authenticate

module.exports = router;