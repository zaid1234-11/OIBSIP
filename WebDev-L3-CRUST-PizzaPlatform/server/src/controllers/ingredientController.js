import Ingredient from '../models/Ingredient.js';

// GET /api/ingredients
export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    return res.status(200).json({ ingredients });
  } catch (error) {
    console.error('[getIngredients Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch ingredients.' });
  }
};

// POST /api/ingredients (Admin)
export const createIngredient = async (req, res) => {
  try {
    const { name, unit, currentStock, minimumStock, maximumStock, costPerUnit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ error: 'Name and unit are required.' });
    }

    const ingredient = await Ingredient.create({
      name: name.trim(),
      unit,
      currentStock: Number(currentStock) || 0,
      minimumStock: Number(minimumStock) || 0,
      maximumStock: Number(maximumStock) || 1000,
      costPerUnit: Number(costPerUnit) || 0
    });

    return res.status(201).json({
      message: 'Ingredient created successfully.',
      ingredient
    });
  } catch (error) {
    console.error('[createIngredient Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to create ingredient.' });
  }
};

// PUT /api/ingredients/:id (Admin)
export const updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    return res.status(200).json({
      message: 'Ingredient updated successfully.',
      ingredient
    });
  } catch (error) {
    console.error('[updateIngredient Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to update ingredient.' });
  }
};

// DELETE /api/ingredients/:id (Admin)
export const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found.' });
    }

    return res.status(200).json({
      message: 'Ingredient deleted successfully.',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('[deleteIngredient Error]:', error);
    return res.status(500).json({ error: 'Failed to delete ingredient.' });
  }
};

export default {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient
};
