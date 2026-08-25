import crypto from 'crypto';
import Order from '../models/Order.js';
import { razorpay, isMock } from '../config/razorpay.js';
import env from '../config/env.js';

// POST /api/payments/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Auth verification: only the owner or an admin can initiate payment
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: cannot pay for another user\'s order.' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'This order has already been paid.' });
    }

    if (isMock) {
      const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      order.razorpayOrderId = mockOrderId;
      await order.save();

      return res.status(200).json({
        id: mockOrderId,
        amount: order.total * 100, // in paise
        currency: 'INR',
        receipt: order.orderCode,
        key: 'rzp_test_placeholder',
        isMock: true
      });
    } else {
      const options = {
        amount: order.total * 100, // amount in the smallest currency unit (paise)
        currency: 'INR',
        receipt: order.orderCode
      };

      const razorpayOrder = await razorpay.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(200).json({
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
        key: env.razorpay.keyId,
        isMock: false
      });
    }
  } catch (error) {
    console.error('[createPaymentOrder Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to create payment order.' });
  }
};

// POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      mockSuccess
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'CRUST Order ID is required.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Auth verification: only the owner or an admin can verify payment
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (isMock) {
      if (mockSuccess === false || razorpay_payment_id === 'failed' || razorpay_signature === 'failed') {
        order.paymentStatus = 'failed';
        if (!order.statusHistory.some(h => h.status === 'pending_payment')) {
          order.statusHistory.push({ status: 'pending_payment', changedAt: new Date() });
        }
        await order.save();
        return res.status(400).json({ error: 'Mock payment failed or cancelled.' });
      }

      // Success
      order.paymentStatus = 'paid';
      order.orderStatus = 'ordered';
      order.razorpayPaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
      order.razorpayOrderId = razorpay_order_id || order.razorpayOrderId;
      
      // Update history
      order.statusHistory.push({ status: 'ordered', changedAt: new Date() });
      await order.save();

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully (Simulated).',
        order
      });
    } else {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing Razorpay checkout credentials.' });
      }

      // Verify signature using SHA-256 HMAC
      const generated_signature = crypto
        .createHmac('sha256', env.razorpay.keySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature === razorpay_signature) {
        order.paymentStatus = 'paid';
        order.orderStatus = 'ordered';
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
        
        order.statusHistory.push({ status: 'ordered', changedAt: new Date() });
        await order.save();

        return res.status(200).json({
          success: true,
          message: 'Payment verified successfully.',
          order
        });
      } else {
        order.paymentStatus = 'failed';
        await order.save();
        return res.status(400).json({ error: 'Payment signature mismatch.' });
      }
    }
  } catch (error) {
    console.error('[verifyPayment Error]:', error);
    return res.status(500).json({ error: error.message || 'Payment verification failed.' });
  }
};
