const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validate,
  registerSchema,
  loginSchema,
  updateProfilSchema,
  updatePasswordSchema
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerSchema, validate, authController.register);
router.post('/login', loginSchema, validate, authController.login);
router.post('/admin/request-pin', authController.requestAdminPin);
router.post('/admin/login', authController.adminLogin);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);

// Routes protégées
router.use(protect);

router.get('/me', authController.getMe);
router.put('/me', updateProfilSchema, validate, authController.updateProfil);
router.put('/me/password', updatePasswordSchema, validate, authController.updatePassword);

module.exports = router;
