import Option from '../models/Option.js';

// GET /api/options
export const getOptions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const options = await Option.find(filter).populate('ingredientUsage.ingredient');
    return res.status(200).json({ options });
  } catch (error) {
    console.error('[getOptions Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch options catalogue.' });
  }
};

// GET /api/options/:id
export const getOptionById = async (req, res) => {
  try {
    const option = await Option.findById(req.params.id).populate('ingredientUsage.ingredient');
    if (!option) {
      return res.status(404).json({ error: 'Option not found.' });
    }
    return res.status(200).json({ option });
  } catch (error) {
    console.error('[getOptionById Error]:', error);
    return res.status(500).json({ error: 'Failed to fetch option.' });
  }
};

// POST /api/options (Admin)
export const createOption = async (req, res) => {
  try {
    const { type, name, priceModifier, ingredientUsage, isAvailable } = req.body;

    if (!type || !name || priceModifier === undefined) {
      return res.status(400).json({ error: 'Type, name, and priceModifier are required.' });
    }

    const option = await Option.create({
      type,
      name: name.trim(),
      priceModifier: Number(priceModifier),
      ingredientUsage: Array.isArray(ingredientUsage) ? ingredientUsage : [],
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    return res.status(201).json({
      message: 'Option created successfully.',
      option
    });
  } catch (error) {
    console.error('[createOption Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to create option.' });
  }
};

// PUT /api/options/:id (Admin)
export const updateOption = async (req, res) => {
  try {
    const option = await Option.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('ingredientUsage.ingredient');

    if (!option) {
      return res.status(404).json({ error: 'Option not found.' });
    }

    return res.status(200).json({
      message: 'Option updated successfully.',
      option
    });
  } catch (error) {
    console.error('[updateOption Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to update option.' });
  }
};

// DELETE /api/options/:id (Admin)
export const deleteOption = async (req, res) => {
  try {
    const option = await Option.findByIdAndDelete(req.params.id);
    if (!option) {
      return res.status(404).json({ error: 'Option not found.' });
    }

    return res.status(200).json({
      message: 'Option deleted successfully.',
      deletedId: req.params.id
    });
  } catch (error) {
    console.error('[deleteOption Error]:', error);
    return res.status(500).json({ error: 'Failed to delete option.' });
  }
};

export default {
  getOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption
};
