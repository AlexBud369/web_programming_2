const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  validateRegister, 
  validateLogin, 
  validatePasswordReset,
  validateChangePassword 
} = require('../middlewares/auth.validators');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/request-password-reset', validatePasswordReset, authController.requestPasswordReset);
router.post('/reset-password', validateResetPassword, authController.resetPassword);
router.post('/change-password', authenticate, validateChangePassword, authController.changePassword);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;