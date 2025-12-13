const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/', tripController.getAll);
router.get('/:id', tripController.getById);
router.get('/:id/exists', tripController.exists);
router.post('/', tripController.create);
router.put('/:id', tripController.update);
router.delete('/:id', tripController.delete);
router.get('/:id/statistics', tripController.getStatistics);

module.exports = router;