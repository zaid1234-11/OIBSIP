import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Pizza from '../models/Pizza.js';
import Option from '../models/Option.js';
import { calculatePizzaPrice } from '../services/pricingService.js';

// Helper to generate unique order code like CR-1048
const generateOrderCode = async () => {
  let unique = false;
  let code = '';
  while (!unique) {
    const num = Math.floor(1000 + Math.random() * 9000);
    code = `CR-${num}`;
    const exists = await Order.findOne({ orderCode: code });
    if (!exists) unique = true;
  }
  return code;
};

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pin) {
      return res.status(400).json({ error: 'Valid delivery address (street, city, pin) is required.' });
    }

    // 1. Fetch user's cart populated
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.pizza')
      .populate('items.size')
      .populate('items.sauce')
      .populate('items.cheese')
      .populate('items.toppings');

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty. Add items to create an order.' });
    }

    // 2. Re-verify every item price and stock availability server-side at order creation time
    const lockedItems = [];
    let calculatedSubtotal = 0;

    for (const item of cart.items) {
      const pricing = calculatePizzaPrice({
        pizza: item.pizza,
        sizeOption: item.size,
        sauceOption: item.sauce,
        cheeseOption: item.cheese,
        toppingOptions: item.toppings || []
      });

      if (!pricing.isAvailable) {
        return res.status(400).json({
          error: `Cannot place order: ${pricing.errors[0]}`,
          errors: pricing.errors
        });
      }

      const lockedItem = {
        pizza: item.pizza ? item.pizza._id : null,
        pizzaName: item.pizza ? item.pizza.name : 'Custom Built Pizza',
        size: item.size._id,
        sizeName: item.size.name,
        sauce: item.sauce._id,
        sauceName: item.sauce.name,
        cheese: item.cheese._id,
        cheeseName: item.cheese.name,
        toppings: (item.toppings || []).map(t => t._id),
        toppingNames: (item.toppings || []).map(t => t.name),
        quantity: item.quantity,
        unitPrice: pricing.unitPrice // Locked in price
      };

      lockedItems.push(lockedItem);
      calculatedSubtotal += (pricing.unitPrice * item.quantity);
    }

    // 3. Calculate delivery, tax, and total
    const deliveryFee = calculatedSubtotal >= 1000 ? 0 : 40;
    const tax = Math.round(calculatedSubtotal * 0.05); // 5% GST
    const total = calculatedSubtotal + deliveryFee + tax;

    // 4. Generate orderCode
    const orderCode = await generateOrderCode();

    // 5. Create Order
    const order = await Order.create({
      orderCode,
      user: req.user.userId,
      items: lockedItems,
      subtotal: calculatedSubtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress: {
        street: deliveryAddress.street.trim(),
        city: deliveryAddress.city.trim(),
        pin: deliveryAddress.pin.trim()
      },
      paymentStatus: 'pending',
      orderStatus: 'pending_payment',
      statusHistory: [
        {
          status: 'pending_payment',
          changedAt: new Date()
        }
      ]
    });

    // 6. Clear user's cart
    cart.items = [];
    cart.subtotal = 0;
    await cart.save();

    return res.status(201).json({
      message: 'Order created successfully.',
      order
    });
  } catch (error) {
    console.error('[createOrder Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to place order.' });
  }
};

// GET /api/orders (Customer's own orders)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('[getMyOrders Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch your orders.' });
  }
};

// GET /api/orders/:id (Owner or Admin)
export const getOrderById = async (req, res) => {
  try {
    const query = req.params.id.startsWith('CR-')
      ? { orderCode: req.params.id.toUpperCase() }
      : { _id: req.params.id };

    const order = await Order.findOne(query).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Authorization check: owner or admin
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: you can only view your own orders.' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error('[getOrderById Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch order details.' });
  }
};

// GET /api/admin/orders (Admin queue)
export const getAdminOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }
    const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('[getAdminOrders Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch admin order queue.' });
  }
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders
};
