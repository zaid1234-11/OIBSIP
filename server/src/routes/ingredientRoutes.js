import express from 'express';
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient
} from '../controllers/ingredientController.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.get('/', getIngredients);
router.post('/', auth, requireRole('admin'), createIngredient);
router.put('/:id', auth, requireRole('admin'), updateIngredient);
router.delete('/:id', auth, requireRole('admin'), deleteIngredient);

export default router;
