import Ingredient from '../models/Ingredient.js';
import Option from '../models/Option.js';
import Pizza from '../models/Pizza.js';

export const seedCatalogue = async () => {
  try {
    const existingPizzaCount = await Pizza.countDocuments();
    if (existingPizzaCount > 0) {
      return; // Catalogue already populated
    }

    console.log('[Seed] Populating initial ingredients, options, and pizzas...');

    // 1. Seed Ingredients
    const ingredientDocs = [
      { name: 'Flour Dough (Fermented)', unit: 'kg', currentStock: 50, minimumStock: 10, maximumStock: 100 },
      { name: 'San Marzano Tomato Sauce', unit: 'ml', currentStock: 25000, minimumStock: 5000, maximumStock: 50000 },
      { name: 'Garlic Alfredo Sauce', unit: 'ml', currentStock: 15000, minimumStock: 3000, maximumStock: 30000 },
      { name: 'Spicy Arrabbiata Sauce', unit: 'ml', currentStock: 12000, minimumStock: 2500, maximumStock: 25000 },
      { name: 'Smoky BBQ Sauce', unit: 'ml', currentStock: 10000, minimumStock: 2000, maximumStock: 20000 },
      { name: 'Whole Milk Mozzarella', unit: 'g', currentStock: 20000, minimumStock: 4000, maximumStock: 40000 },
      { name: 'Smoked Provolone', unit: 'g', currentStock: 15000, minimumStock: 3000, maximumStock: 30000 },
      { name: 'Parmesan & Gorgonzola Blend', unit: 'g', currentStock: 8000, minimumStock: 1500, maximumStock: 15000 },
      { name: 'Vegan Almond Cheese', unit: 'g', currentStock: 6000, minimumStock: 1000, maximumStock: 12000 },
      { name: 'Cupping Pepperoni', unit: 'g', currentStock: 10000, minimumStock: 2000, maximumStock: 20000 },
      { name: 'Fresh Sweet Basil', unit: 'g', currentStock: 5000, minimumStock: 1000, maximumStock: 10000 },
      { name: 'Roasted Bell Peppers', unit: 'g', currentStock: 8000, minimumStock: 1500, maximumStock: 15000 },
      { name: 'Button Mushrooms', unit: 'g', currentStock: 9000, minimumStock: 1800, maximumStock: 18000 },
      { name: 'Kalamata Olives', unit: 'g', currentStock: 7000, minimumStock: 1200, maximumStock: 14000 },
      { name: 'Red Onions', unit: 'g', currentStock: 10000, minimumStock: 2000, maximumStock: 20000 },
      { name: 'Smoked Chicken Strips', unit: 'g', currentStock: 12000, minimumStock: 2500, maximumStock: 25000 },
      { name: 'Calabrian Spicy Salami', unit: 'g', currentStock: 8000, minimumStock: 1500, maximumStock: 15000 },
      { name: 'White Truffle Oil', unit: 'ml', currentStock: 0, minimumStock: 500, maximumStock: 5000 } // Out of stock!
    ];

    const ingredientMap = {};
    for (const item of ingredientDocs) {
      let doc = await Ingredient.findOne({ name: item.name });
      if (!doc) {
        doc = await Ingredient.create(item);
      }
      ingredientMap[item.name] = doc._id;
    }

    // 2. Seed Options
    const optionsData = [
      // Sizes
      { type: 'size', name: 'Small (8")', priceModifier: 199, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.18 }] },
      { type: 'size', name: 'Medium (10")', priceModifier: 299, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 }] },
      { type: 'size', name: 'Large (12")', priceModifier: 399, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.35 }] },

      // Sauces
      { type: 'sauce', name: 'San Marzano Tomato', priceModifier: 0, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['San Marzano Tomato Sauce'], quantity: 80 }] },
      { type: 'sauce', name: 'Creamy Garlic Alfredo', priceModifier: 40, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Garlic Alfredo Sauce'], quantity: 80 }] },
      { type: 'sauce', name: 'Spicy Arrabbiata', priceModifier: 30, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Spicy Arrabbiata Sauce'], quantity: 80 }] },
      { type: 'sauce', name: 'Smoky BBQ', priceModifier: 35, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Smoky BBQ Sauce'], quantity: 80 }] },

      // Cheeses
      { type: 'cheese', name: 'Whole Milk Mozzarella', priceModifier: 0, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Whole Milk Mozzarella'], quantity: 100 }] },
      { type: 'cheese', name: 'Smoked Provolone Blend', priceModifier: 50, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Smoked Provolone'], quantity: 100 }] },
      { type: 'cheese', name: '4-Cheese Blend', priceModifier: 80, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Parmesan & Gorgonzola Blend'], quantity: 100 }] },
      { type: 'cheese', name: 'Vegan Almond Mozzarella', priceModifier: 60, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Vegan Almond Cheese'], quantity: 100 }] },

      // Toppings
      { type: 'topping', name: 'Cupping Pepperoni', priceModifier: 75, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Cupping Pepperoni'], quantity: 50 }] },
      { type: 'topping', name: 'Fresh Sweet Basil', priceModifier: 30, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Fresh Sweet Basil'], quantity: 20 }] },
      { type: 'topping', name: 'Button Mushrooms', priceModifier: 45, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Button Mushrooms'], quantity: 40 }] },
      { type: 'topping', name: 'Roasted Bell Peppers', priceModifier: 40, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Roasted Bell Peppers'], quantity: 40 }] },
      { type: 'topping', name: 'Kalamata Olives', priceModifier: 50, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Kalamata Olives'], quantity: 35 }] },
      { type: 'topping', name: 'Red Onions', priceModifier: 25, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Red Onions'], quantity: 30 }] },
      { type: 'topping', name: 'Smoked Chicken Strips', priceModifier: 80, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Smoked Chicken Strips'], quantity: 60 }] },
      { type: 'topping', name: 'Calabrian Spicy Salami', priceModifier: 85, isAvailable: true, ingredientUsage: [{ ingredient: ingredientMap['Calabrian Spicy Salami'], quantity: 50 }] },
      { type: 'topping', name: 'White Truffle Drizzle', priceModifier: 95, isAvailable: false, ingredientUsage: [{ ingredient: ingredientMap['White Truffle Oil'], quantity: 15 }] }
    ];

    for (const opt of optionsData) {
      const existingOpt = await Option.findOne({ name: opt.name, type: opt.type });
      if (!existingOpt) {
        await Option.create(opt);
      }
    }

    // 3. Seed Signature Pizzas
    const pizzasData = [
      {
        name: 'Margherita Classica',
        description: 'San Marzano D.O.P. tomato sauce, fresh whole milk fiordilatte mozzarella, torn sweet basil leaves, and extra virgin olive oil.',
        basePrice: 299,
        category: 'veg',
        image: 'margherita',
        isAvailable: true,
        defaultRecipe: [
          { ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 },
          { ingredient: ingredientMap['San Marzano Tomato Sauce'], quantity: 80 },
          { ingredient: ingredientMap['Whole Milk Mozzarella'], quantity: 100 },
          { ingredient: ingredientMap['Fresh Sweet Basil'], quantity: 20 }
        ]
      },
      {
        name: 'Rustic Pepperoni',
        description: 'Crispy charred cupping pepperoni, aged whole-milk mozzarella, crushed oregano, and hot honey drizzle.',
        basePrice: 449,
        category: 'non-veg',
        image: 'pepperoni',
        isAvailable: true,
        defaultRecipe: [
          { ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 },
          { ingredient: ingredientMap['San Marzano Tomato Sauce'], quantity: 80 },
          { ingredient: ingredientMap['Whole Milk Mozzarella'], quantity: 100 },
          { ingredient: ingredientMap['Cupping Pepperoni'], quantity: 50 }
        ]
      },
      {
        name: 'Tuscan Garden',
        description: 'Fire-roasted sweet bell peppers, red onions, sliced button mushrooms, kalamata olives, and fresh herb blend.',
        basePrice: 379,
        category: 'veg',
        image: 'tuscan-garden',
        isAvailable: true,
        defaultRecipe: [
          { ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 },
          { ingredient: ingredientMap['San Marzano Tomato Sauce'], quantity: 80 },
          { ingredient: ingredientMap['Whole Milk Mozzarella'], quantity: 80 },
          { ingredient: ingredientMap['Roasted Bell Peppers'], quantity: 40 },
          { ingredient: ingredientMap['Button Mushrooms'], quantity: 40 },
          { ingredient: ingredientMap['Kalamata Olives'], quantity: 35 }
        ]
      },
      {
        name: 'Quattro Formaggi',
        description: 'Whole milk mozzarella, gorgonzola dolce, smoked provolone, shaved aged parmesan, and cracked black pepper.',
        basePrice: 499,
        category: 'veg',
        image: 'quattro-formaggi',
        isAvailable: true,
        defaultRecipe: [
          { ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 },
          { ingredient: ingredientMap['Whole Milk Mozzarella'], quantity: 80 },
          { ingredient: ingredientMap['Smoked Provolone'], quantity: 50 },
          { ingredient: ingredientMap['Parmesan & Gorgonzola Blend'], quantity: 50 }
        ]
      },
      {
        name: 'Spicy Diavola',
        description: 'Calabrian chili paste, spicy artisanal salami, slivered red onions, fresh mozzarella, and chili oil drizzle.',
        basePrice: 469,
        category: 'non-veg',
        image: 'diavola',
        isAvailable: true,
        defaultRecipe: [
          { ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 },
          { ingredient: ingredientMap['Spicy Arrabbiata Sauce'], quantity: 80 },
          { ingredient: ingredientMap['Whole Milk Mozzarella'], quantity: 100 },
          { ingredient: ingredientMap['Calabrian Spicy Salami'], quantity: 50 },
          { ingredient: ingredientMap['Red Onions'], quantity: 30 }
        ]
      },
      {
        name: 'Smoked BBQ Chicken',
        description: 'Hickory smoked BBQ sauce base, tender roasted chicken strips, caramelized red onions, and smoked provolone.',
        basePrice: 479,
        category: 'non-veg',
        image: 'bbq-chicken',
        isAvailable: true,
        defaultRecipe: [
          { ingredient: ingredientMap['Flour Dough (Fermented)'], quantity: 0.25 },
          { ingredient: ingredientMap['Smoky BBQ Sauce'], quantity: 80 },
          { ingredient: ingredientMap['Smoked Provolone'], quantity: 90 },
          { ingredient: ingredientMap['Smoked Chicken Strips'], quantity: 60 },
          { ingredient: ingredientMap['Red Onions'], quantity: 30 }
        ]
      }
    ];

    for (const p of pizzasData) {
      const existing = await Pizza.findOne({ name: p.name });
      if (!existing) {
        await Pizza.create(p);
      }
    }

    console.log('[Seed] Catalogue seeded successfully with 18 ingredients, 20 options, and 6 pizzas.');
  } catch (err) {
    console.error('[Seed Error]:', err);
  }
};

export default seedCatalogue;
