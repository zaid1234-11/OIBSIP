import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All payment routes require Customer authentication
router.post('/create-order', auth, createPaymentOrder);
router.post('/verify', auth, verifyPayment);

export default router;
