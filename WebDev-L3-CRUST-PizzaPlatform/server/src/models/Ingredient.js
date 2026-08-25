import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    unique: true
  },
  unit: {
    type: String,
    enum: ['g', 'kg', 'ml', 'unit'],
    required: [true, 'Unit is required']
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  minimumStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  maximumStock: {
    type: Number,
    required: true,
    default: 1000,
    min: 0
  },
  costPerUnit: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
