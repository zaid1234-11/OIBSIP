/**
 * Standalone Pricing Utility for CRUST Pizza Platform
 *
 * Calculates the exact server-side price for standard or customized pizzas,
 * validating ingredient and option availability.
 */

export const calculatePizzaPrice = ({
  pizza = null,
  basePrice = null,
  sizeOption = null,
  sauceOption = null,
  cheeseOption = null,
  toppingOptions = []
}) => {
  const errors = [];
  let isAvailable = true;

  // Determine starting base price
  let resolvedBasePrice = 0;
  if (pizza && typeof pizza.basePrice === 'number') {
    resolvedBasePrice = pizza.basePrice;
    if (pizza.isAvailable === false) {
      isAvailable = false;
      errors.push(`Pizza '${pizza.name}' is currently unavailable`);
    }
  } else if (typeof basePrice === 'number') {
    resolvedBasePrice = basePrice;
  }

  // Size Modifier
  let sizeModifier = 0;
  if (sizeOption) {
    sizeModifier = sizeOption.priceModifier || 0;
    if (sizeOption.isAvailable === false) {
      isAvailable = false;
      errors.push(`Size option '${sizeOption.name}' is currently out of stock`);
    }
  }

  // Sauce Modifier
  let sauceModifier = 0;
  if (sauceOption) {
    sauceModifier = sauceOption.priceModifier || 0;
    if (sauceOption.isAvailable === false) {
      isAvailable = false;
      errors.push(`Sauce option '${sauceOption.name}' is currently out of stock`);
    }
  }

  // Cheese Modifier
  let cheeseModifier = 0;
  if (cheeseOption) {
    cheeseModifier = cheeseOption.priceModifier || 0;
    if (cheeseOption.isAvailable === false) {
      isAvailable = false;
      errors.push(`Cheese option '${cheeseOption.name}' is currently out of stock`);
    }
  }

  // Toppings Modifier Sum
  let toppingsTotal = 0;
  const toppingsList = Array.isArray(toppingOptions) ? toppingOptions : [];
  const toppingBreakdowns = [];

  for (const topping of toppingsList) {
    if (!topping) continue;
    const mod = topping.priceModifier || 0;
    toppingsTotal += mod;
    toppingBreakdowns.push({
      id: topping._id || topping.id,
      name: topping.name,
      price: mod,
      isAvailable: topping.isAvailable !== false
    });

    if (topping.isAvailable === false) {
      isAvailable = false;
      errors.push(`Topping '${topping.name}' is currently out of stock`);
    }
  }

  // Calculate final total unit price
  const unitPrice = Math.max(0, resolvedBasePrice + sizeModifier + sauceModifier + cheeseModifier + toppingsTotal);

  return {
    basePrice: resolvedBasePrice,
    sizeModifier,
    sauceModifier,
    cheeseModifier,
    toppingsTotal,
    unitPrice,
    isAvailable,
    errors,
    breakdown: {
      base: resolvedBasePrice,
      size: sizeOption ? { name: sizeOption.name, price: sizeModifier } : null,
      sauce: sauceOption ? { name: sauceOption.name, price: sauceModifier } : null,
      cheese: cheeseOption ? { name: cheeseOption.name, price: cheeseModifier } : null,
      toppings: toppingBreakdowns
    }
  };
};

export default {
  calculatePizzaPrice
};
