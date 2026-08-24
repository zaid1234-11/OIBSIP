import mongoose from 'mongoose';

const recipeItemSchema = new mongoose.Schema({
  ingredient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Pizza description is required'],
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: [true, 'Category (veg / non-veg) is required']
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  defaultRecipe: [recipeItemSchema]
}, {
  timestamps: true
});

export const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;
