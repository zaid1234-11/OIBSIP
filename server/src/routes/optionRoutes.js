import express from 'express';
import {
  getOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption
} from '../controllers/optionController.js';
import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Public routes per Section 5
router.get('/', getOptions);
router.get('/:id', getOptionById);

// Admin-only CRUD routes
router.post('/', auth, requireRole('admin'), createOption);
router.put('/:id', auth, requireRole('admin'), updateOption);
router.delete('/:id', auth, requireRole('admin'), deleteOption);

export default router;
