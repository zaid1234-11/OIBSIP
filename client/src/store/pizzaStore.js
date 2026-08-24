import { create } from 'zustand';
import api from '../services/api';

export const usePizzaStore = create((set, get) => ({
  pizzas: [],
  options: [],
  sizes: [],
  sauces: [],
  cheeses: [],
  toppings: [],
  loading: false,
  error: null,

  // Builder State
  selectedSize: null,
  selectedSauce: null,
  selectedCheese: null,
  selectedToppings: [],
  currentPrice: 299,
  priceLoading: false,
  isAvailable: true,
  priceErrors: [],

  fetchCatalogue: async () => {
    set({ loading: true, error: null });
    try {
      const [pizzasRes, optionsRes] = await Promise.all([
        api.get('/pizzas'),
        api.get('/options')
      ]);

      const pizzas = pizzasRes.data.pizzas || [];
      const options = optionsRes.data.options || [];

      const sizes = options.filter(o => o.type === 'size');
      const sauces = options.filter(o => o.type === 'sauce');
      const cheeses = options.filter(o => o.type === 'cheese');
      const toppings = options.filter(o => o.type === 'topping');

      // Set default builder selections if not already set
      const defaultSize = sizes.find(s => s.name.includes('Medium')) || sizes[0] || null;
      const defaultSauce = sauces.find(s => s.name.includes('Tomato')) || sauces[0] || null;
      const defaultCheese = cheeses.find(c => c.name.includes('Mozzarella')) || cheeses[0] || null;

      set({
        pizzas,
        options,
        sizes,
        sauces,
        cheeses,
        toppings,
        selectedSize: get().selectedSize || defaultSize,
        selectedSauce: get().selectedSauce || defaultSauce,
        selectedCheese: get().selectedCheese || defaultCheese,
        loading: false
      });

      get().recalculatePrice();
    } catch (err) {
      console.error('Failed to load catalogue:', err);
      set({ error: 'Failed to load pizza catalogue.', loading: false });
    }
  },

  selectSize: (size) => {
    set({ selectedSize: size });
    get().recalculatePrice();
  },

  selectSauce: (sauce) => {
    set({ selectedSauce: sauce });
    get().recalculatePrice();
  },

  selectCheese: (cheese) => {
    set({ selectedCheese: cheese });
    get().recalculatePrice();
  },

  toggleTopping: (topping) => {
    const current = get().selectedToppings;
    const exists = current.some(t => t._id === topping._id);
    let updated;
    if (exists) {
      updated = current.filter(t => t._id !== topping._id);
    } else {
      updated = [...current, topping];
    }
    set({ selectedToppings: updated });
    get().recalculatePrice();
  },

  recalculatePrice: async () => {
    const { selectedSize, selectedSauce, selectedCheese, selectedToppings } = get();
    if (!selectedSize) return;

    // Quick client-side optimistic calculation
    const base = selectedSize.priceModifier || 0;
    const sauce = selectedSauce?.priceModifier || 0;
    const cheese = selectedCheese?.priceModifier || 0;
    const toppingsTotal = selectedToppings.reduce((acc, t) => acc + (t.priceModifier || 0), 0);
    const optimisticTotal = base + sauce + cheese + toppingsTotal;
    set({ currentPrice: optimisticTotal });

    // Server-verified price calculation
    try {
      const response = await api.post('/pizzas/calculate-price', {
        sizeId: selectedSize._id,
        sauceId: selectedSauce?._id,
        cheeseId: selectedCheese?._id,
        toppingIds: selectedToppings.map(t => t._id)
      });

      set({
        currentPrice: response.data.unitPrice,
        isAvailable: response.data.isAvailable,
        priceErrors: response.data.errors || []
      });
    } catch (err) {
      console.warn('Server price check notice:', err);
    }
  },

  resetBuilder: () => {
    const { sizes, sauces, cheeses } = get();
    set({
      selectedSize: sizes.find(s => s.name.includes('Medium')) || sizes[0] || null,
      selectedSauce: sauces.find(s => s.name.includes('Tomato')) || sauces[0] || null,
      selectedCheese: cheeses.find(c => c.name.includes('Mozzarella')) || cheeses[0] || null,
      selectedToppings: [],
      currentPrice: 299,
      isAvailable: true,
      priceErrors: []
    });
  }
}));

export default usePizzaStore;
