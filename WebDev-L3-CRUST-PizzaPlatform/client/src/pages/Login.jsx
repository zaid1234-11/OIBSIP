import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { user, token } = response.data;
      login(user, token);

      addToast(`Welcome back, ${user.name}!`, { type: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">Welcome Back</h1>
          <p className="text-sm text-[#736254] mt-1.5">Sign in to reorder your saved pizza builds</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4">
          {error && (
            <div className="p-3.5 rounded-[12px] bg-[#E4572E]/10 border border-[#E4572E]/30 text-xs font-semibold text-[#C33C14]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-[#E4572E] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="customer-primary"
            loading={loading}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-[#736254] mt-6">
          Need an account? <Link to="/register" className="font-semibold text-[#E4572E] hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
