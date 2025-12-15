const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/', tripController.getAll);
router.get('/exists', tripController.exists);
router.get('/:id', tripController.getById);
router.get('/:id/exists', tripController.exists);
router.put('/:id', tripController.update);
router.delete('/:id', tripController.delete);

module.exports = router;