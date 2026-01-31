const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  validateUserCreate,
  validateUserUpdate,
  validateRoleChange,
  validateBulkUpdate,
  validateIdParam
} = require('../middlewares/user.validators');

router.use(authenticate, authorize('admin'));

router.get('/', userController.getAll);
router.get('/:id', validateIdParam, userController.getById);
router.post('/', validateUserCreate, userController.create);
router.patch('/:id', validateIdParam, validateUserUpdate, userController.update);
router.patch('/:id/role', validateIdParam, validateRoleChange, userController.changeRole);
router.delete('/:id', validateIdParam, userController.delete);
router.post('/bulk-update-roles', validateBulkUpdate, userController.bulkUpdateRoles);
router.get('/:id/exists', validateIdParam, userController.exists);

module.exports = router;