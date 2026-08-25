import express from 'express';
import { adminLogin } from '../controllers/authController.js';
import {
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus,
  getAdminCustomers
} from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Public admin auth entry point per spec section 5
router.post('/auth/login', adminLogin);

// Protected admin ping/test verification route
router.get('/test', auth, requireRole('admin'), (req, res) => {
  res.status(200).json({
    ok: true,
    admin: true,
    message: 'Welcome Admin: Authorized access confirmed.',
    user: req.user
  });
});

// Admin Dashboard stats & aggregations
router.get('/dashboard/stats', auth, requireRole('admin'), getDashboardStats);

// Admin Order queue management
router.get('/orders', auth, requireRole('admin'), getAdminOrders);
router.patch('/orders/:id/status', auth, requireRole('admin'), updateOrderStatus);

// Customers directory
router.get('/customers', auth, requireRole('admin'), getAdminCustomers);

export default router;
