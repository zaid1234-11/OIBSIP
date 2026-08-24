import { create } from 'zustand';
import api from '../services/api';

export const useCartStore = create((set, get) => ({
  cart: { items: [], subtotal: 0 },
  loading: false,
  error: null,

  get itemCount() {
    return (get().cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);
  },

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/cart');
      set({
        cart: response.data.cart || { items: [], subtotal: 0 },
        loading: false
      });
    } catch (err) {
      console.warn('Cart fetch notice:', err.response?.data?.error || err.message);
      set({ loading: false });
    }
  },

  addItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/cart/items', itemData);
      set({
        cart: response.data.cart,
        loading: false
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add item to cart.';
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await api.patch(`/cart/items/${itemId}`, { quantity });
      set({ cart: response.data.cart });
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      set({ cart: response.data.cart });
    } catch (err) {
      console.error('Remove item error:', err);
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cart: { items: [], subtotal: 0 } });
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  }
}));

export default useCartStore;
