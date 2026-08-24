import { create } from 'zustand';
import api from '../services/api';

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('crust_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  return localStorage.getItem('crust_token') || null;
};

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: Boolean(getInitialToken()),
  isAdmin: getInitialUser()?.role === 'admin',
  loading: false,

  login: (user, token) => {
    localStorage.setItem('crust_token', token);
    localStorage.setItem('crust_user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin'
    });
  },

  setUser: (user) => {
    localStorage.setItem('crust_user', JSON.stringify(user));
    set({
      user,
      isAdmin: user?.role === 'admin'
    });
  },

  logout: () => {
    localStorage.removeItem('crust_token');
    localStorage.removeItem('crust_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false
    });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return null;

    set({ loading: true });
    try {
      const response = await api.get('/auth/me');
      const user = response.data.user;
      get().setUser(user);
      set({ loading: false });
      return user;
    } catch {
      get().logout();
      set({ loading: false });
      return null;
    }
  }
}));

export default useAuthStore;
