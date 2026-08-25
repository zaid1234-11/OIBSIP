import express from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public auth endpoints per spec section 5
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected user profile
router.get('/me', auth, getMe);

export default router;
