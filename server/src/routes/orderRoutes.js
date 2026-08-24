import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Customer routes
router.post('/', auth, createOrder);
router.get('/', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

// Admin-only order queue route
router.get('/admin/queue', auth, requireRole('admin'), getAdminOrders);

export default router;
