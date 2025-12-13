const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/', activityController.getAll);
router.get('/:id', activityController.getById);
router.get('/:id/exists', activityController.exists);
router.post('/', activityController.create);
router.put('/:id', activityController.update);
router.delete('/:id', activityController.delete);

module.exports = router;