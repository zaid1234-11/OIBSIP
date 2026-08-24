import mongoose from 'mongoose';

const ingredientUsageSchema = new mongoose.Schema({
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

const optionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['size', 'sauce', 'cheese', 'topping'],
    required: [true, 'Option type is required']
  },
  name: {
    type: String,
    required: [true, 'Option name is required'],
    trim: true
  },
  priceModifier: {
    type: Number,
    required: true,
    default: 0
  },
  ingredientUsage: [ingredientUsageSchema],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Option = mongoose.model('Option', optionSchema);
export default Option;
