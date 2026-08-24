import express from 'express';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All Cart routes require Customer authentication
router.get('/', auth, getCart);
router.post('/items', auth, addCartItem);
router.patch('/items/:itemId', auth, updateCartItem);
router.delete('/items/:itemId', auth, removeCartItem);
router.delete('/', auth, clearCart);

export default router;
