import Cart from '../models/Cart.js';
import Pizza from '../models/Pizza.js';
import Option from '../models/Option.js';
import { calculatePizzaPrice } from '../services/pricingService.js';

// Helper to populate full cart item details
const populateCart = (query) => {
  return query
    .populate('items.pizza', 'name category image basePrice')
    .populate('items.size', 'name priceModifier')
    .populate('items.sauce', 'name priceModifier')
    .populate('items.cheese', 'name priceModifier')
    .populate('items.toppings', 'name priceModifier');
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await populateCart(Cart.findOne({ user: req.user.userId }));
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [], subtotal: 0 });
    }
    return res.status(200).json({ cart });
  } catch (error) {
    console.error('[getCart Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch cart.' });
  }
};

// POST /api/cart/items
export const addCartItem = async (req, res) => {
  try {
    const { pizzaId, sizeId, sauceId, cheeseId, toppingIds = [], quantity = 1 } = req.body;

    if (!sizeId || !sauceId || !cheeseId) {
      return res.status(400).json({ error: 'Size, sauce, and cheese selections are required.' });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // Fetch documents from database
    let pizza = null;
    if (pizzaId) {
      pizza = await Pizza.findById(pizzaId);
      if (!pizza) {
        return res.status(404).json({ error: 'Selected pizza was not found.' });
      }
    }

    const sizeOption = await Option.findById(sizeId);
    const sauceOption = await Option.findById(sauceId);
    const cheeseOption = await Option.findById(cheeseId);

    if (!sizeOption || !sauceOption || !cheeseOption) {
      return res.status(404).json({ error: 'One or more selected builder options do not exist.' });
    }

    let toppingOptions = [];
    if (Array.isArray(toppingIds) && toppingIds.length > 0) {
      toppingOptions = await Option.find({ _id: { $in: toppingIds } });
    }

    // Authoritative server-side price calculation
    const pricing = calculatePizzaPrice({
      pizza,
      sizeOption,
      sauceOption,
      cheeseOption,
      toppingOptions
    });

    if (!pricing.isAvailable) {
      return res.status(400).json({
        error: pricing.errors[0] || 'Selected items are currently out of stock.',
        errors: pricing.errors
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Sort topping IDs for consistent comparison
    const sortedNewToppings = toppingOptions.map(t => t._id.toString()).sort().join(',');

    // Check for existing matching item in cart
    const existingIndex = cart.items.findIndex(item => {
      const matchPizza = (item.pizza ? item.pizza.toString() : null) === (pizzaId ? pizzaId.toString() : null);
      const matchSize = item.size.toString() === sizeId.toString();
      const matchSauce = item.sauce.toString() === sauceId.toString();
      const matchCheese = item.cheese.toString() === cheeseId.toString();
      const itemToppings = (item.toppings || []).map(t => t.toString()).sort().join(',');
      return matchPizza && matchSize && matchSauce && matchCheese && itemToppings === sortedNewToppings;
    });

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
      cart.items[existingIndex].unitPrice = pricing.unitPrice; // update with latest validated price
    } else {
      cart.items.push({
        pizza: pizzaId || null,
        size: sizeId,
        sauce: sauceId,
        cheese: cheeseId,
        toppings: toppingOptions.map(t => t._id),
        quantity: qty,
        unitPrice: pricing.unitPrice
      });
    }

    cart.calculateSubtotal();
    await cart.save();

    const populatedCart = await populateCart(Cart.findById(cart._id));
    return res.status(200).json({
      message: 'Item added to cart.',
      cart: populatedCart
    });
  } catch (error) {
    console.error('[addCartItem Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to add item to cart.' });
  }
};

// PATCH /api/cart/items/:itemId
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(i => i._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart.' });
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = qty;
    }

    cart.calculateSubtotal();
    await cart.save();

    const populatedCart = await populateCart(Cart.findById(cart._id));
    return res.status(200).json({
      message: 'Cart updated.',
      cart: populatedCart
    });
  } catch (error) {
    console.error('[updateCartItem Error]:', error);
    return res.status(500).json({ error: 'Failed to update cart item.' });
  }
};

// DELETE /api/cart/items/:itemId
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    cart.items = cart.items.filter(i => i._id.toString() !== itemId);
    cart.calculateSubtotal();
    await cart.save();

    const populatedCart = await populateCart(Cart.findById(cart._id));
    return res.status(200).json({
      message: 'Item removed from cart.',
      cart: populatedCart
    });
  } catch (error) {
    console.error('[removeCartItem Error]:', error);
    return res.status(500).json({ error: 'Failed to remove cart item.' });
  }
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      await cart.save();
    }
    return res.status(200).json({
      message: 'Cart cleared.',
      cart: { items: [], subtotal: 0 }
    });
  } catch (error) {
    console.error('[clearCart Error]:', error);
    return res.status(500).json({ error: 'Failed to clear cart.' });
  }
};

export default {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
};
