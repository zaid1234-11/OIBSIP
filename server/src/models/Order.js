import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  pizza: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    default: null
  },
  pizzaName: {
    type: String,
    default: 'Custom Built Pizza'
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  sizeName: {
    type: String,
    required: true
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  sauceName: {
    type: String,
    required: true
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: true
  },
  cheeseName: {
    type: String,
    required: true
  },
  toppings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option'
  }],
  toppingNames: [{
    type: String
  }],
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending_payment', 'ordered', 'kitchen', 'out_for_delivery', 'delivered', 'cancelled']
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 40,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending_payment', 'ordered', 'kitchen', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending_payment'
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  statusHistory: [statusHistorySchema]
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
export default Order;
