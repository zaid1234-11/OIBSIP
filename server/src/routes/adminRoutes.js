import express from 'express';
import { adminLogin } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Public admin auth entry point per spec section 5
router.post('/auth/login', adminLogin);

// Protected admin ping/test verification route (strictly requires auth + admin role)
router.get('/test', auth, requireRole('admin'), (req, res) => {
  res.status(200).json({
    ok: true,
    admin: true,
    message: 'Welcome Admin: Authorized access confirmed.',
    user: req.user
  });
});

export default router;
