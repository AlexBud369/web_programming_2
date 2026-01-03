const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');
const { validateRoute, validateIdParam } = require('../middlewares/validation');

router.post('/', validateRoute, routeController.create);
router.get('/', routeController.getAll);
router.get('/:id', validateIdParam, routeController.getById);
router.put('/:id', validateIdParam, validateRoute, routeController.update);
router.delete('/:id', validateIdParam, routeController.remove);
router.head('/:id', validateIdParam, routeController.checkExists);

module.exports = router;