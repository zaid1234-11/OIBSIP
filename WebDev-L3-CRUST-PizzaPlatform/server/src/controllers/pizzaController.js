import Pizza from '../models/Pizza.js';
import Option from '../models/Option.js';
import { calculatePizzaPrice } from '../services/pricingService.js';

// GET /api/pizzas
export const getAllPizzas = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const pizzas = await Pizza.find(filter).populate('defaultRecipe.ingredient');
    return res.status(200).json({ pizzas });
  } catch (error) {
    console.error('[getAllPizzas Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch pizzas catalogue.' });
  }
};

// GET /api/pizzas/:id
export const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id).populate('defaultRecipe.ingredient');
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found.' });
    }
    return res.status(200).json({ pizza });
  } catch (error) {
    console.error('[getPizzaById Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch pizza details.' });
  }
};

// POST /api/pizzas/calculate-price
export const calculateCustomPrice = async (req, res) => {
  try {
    const { pizzaId, basePrice, sizeId, sauceId, cheeseId, toppingIds } = req.body;

    let pizza = null;
    if (pizzaId) {
      pizza = await Pizza.findById(pizzaId);
    }

    const sizeOption = sizeId ? await Option.findById(sizeId) : null;
    const sauceOption = sauceId ? await Option.findById(sauceId) : null;
    const cheeseOption = cheeseId ? await Option.findById(cheeseId) : null;

    let toppingOptions = [];
    if (Array.isArray(toppingIds) && toppingIds.length > 0) {
      toppingOptions = await Option.find({ _id: { $in: toppingIds } });
    }

    const priceResult = calculatePizzaPrice({
      pizza,
      basePrice,
      sizeOption,
      sauceOption,
      cheeseOption,
      toppingOptions
    });

    return res.status(200).json(priceResult);
  } catch (error) {
    console.error('[calculateCustomPrice Error]:', error);
    return res.status(500).json({ error: 'Failed to calculate custom pizza price.' });
  }
};

// POST /api/pizzas (Admin)
export const createPizza = async (req, res) => {
  try {
    const { name, description, basePrice, category, image, isAvailable, defaultRecipe } = req.body;

    if (!name || !description || basePrice === undefined || !category) {
      return res.status(400).json({ error: 'Name, description, basePrice, and category are required.' });
    }

    const existing = await Pizza.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: `A pizza named '${name}' already exists.` });
    }

    const pizza = await Pizza.create({
      name: name.trim(),
      description: description.trim(),
      basePrice: Number(basePrice),
      category,
      image: image || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      defaultRecipe: Array.isArray(defaultRecipe) ? defaultRecipe : []
    });

    return res.status(201).json({
      message: 'Pizza created successfully.',
      pizza
    });
  } catch (error) {
    console.error('[createPizza Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to create pizza.' });
  }
};

// PUT /api/pizzas/:id (Admin)
export const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('defaultRecipe.ingredient');

    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found.' });
    }

    return res.status(200).json({
      message: 'Pizza updated successfully.',
      pizza
    });
  } catch (error) {
    console.error('[updatePizza Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to update pizza.' });
  }
};

// DELETE /api/pizzas/:id (Admin)
export const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found.' });
    }

    return res.status(200).json({
      message: 'Pizza deleted successfully.',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('[deletePizza Error]:', error);
    return res.status(500).json({ error: 'Failed to delete pizza.' });
  }
};

export default {
  getAllPizzas,
  getPizzaById,
  calculateCustomPrice,
  createPizza,
  updatePizza,
  deletePizza
};
