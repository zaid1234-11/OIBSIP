import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import CustomerLayout from './components/layouts/CustomerLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Auth Guard
import ProtectedRoute from './components/auth/ProtectedRoute';

// Customer pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import PizzaDetail from './pages/PizzaDetail';
import PizzaBuilder from './pages/PizzaBuilder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './admin/Dashboard';
import AdminOrders from './admin/Orders';
import AdminOrderDetail from './admin/OrderDetail';
import Inventory from './admin/Inventory';
import Pizzas from './admin/Pizzas';
import Customers from './admin/Customers';
import Settings from './admin/Settings';

// Dev
import StyleGuide from './pages/StyleGuide';
import useAuthStore from './store/authStore';

export function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      {/* Customer routes with shared layout */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/pizza/:id" element={<PizzaDetail />} />
        <Route path="/build-your-pizza" element={<PizzaBuilder />} />
        <Route path="/cart" element={<Cart />} />

        {/* Public auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Dev route */}
        <Route path="/styleguide" element={<StyleGuide />} />
      </Route>

      {/* Admin login (standalone, outside admin layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin routes */}
      <Route
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/pizzas" element={<Pizzas />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
