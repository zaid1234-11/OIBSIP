import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    default: null
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: [true, 'Size option is required']
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: [true, 'Sauce option is required']
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: [true, 'Cheese option is required']
  },
  toppings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option'
  }],
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Helper method to compute subtotal
cartSchema.methods.calculateSubtotal = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  return this.subtotal;
};

export const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
