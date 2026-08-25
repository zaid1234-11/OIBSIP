import express from 'express';
import {
  getAllPizzas,
  getPizzaById,
  calculateCustomPrice,
  createPizza,
  updatePizza,
  deletePizza
} from '../controllers/pizzaController.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Public routes per Section 5
router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);
router.post('/calculate-price', calculateCustomPrice);

// Admin-only CRUD routes
router.post('/', auth, requireRole('admin'), createPizza);
router.put('/:id', auth, requireRole('admin'), updatePizza);
router.delete('/:id', auth, requireRole('admin'), deletePizza);

export default router;
