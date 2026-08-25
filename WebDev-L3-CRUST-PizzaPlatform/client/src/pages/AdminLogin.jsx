import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please enter admin credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { user, token } = response.data;
      login(user, token);

      addToast(`Admin access granted. Welcome, ${user.name}!`, { type: 'success' });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid admin credentials or unauthorized role.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemoAdmin = () => {
    setFormData({
      email: 'admin@crustpizza.com',
      password: 'Admin@12345'
    });
  };

  return (
    <div className="theme-admin min-h-screen flex items-center justify-center px-4 bg-[#14110F] text-[#F6EEDF]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-display text-3xl font-extrabold tracking-[0.18em] text-[#F6EEDF] uppercase">
              CRUST
            </span>
            <span className="text-[11px] font-mono font-bold bg-[#E4572E] text-white px-2.5 py-0.5 rounded uppercase">
              Admin Portal
            </span>
          </div>
          <p className="text-sm text-[#A89E94]">Sign in to access order queue and inventory controls</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2C2621] rounded-[20px] p-7 border border-[#4A433C] space-y-4 shadow-2xl">
          {error && (
            <div className="p-3.5 rounded-[12px] bg-[#E4572E]/15 border border-[#E4572E]/40 text-xs font-semibold text-[#E4572E] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#A89E94] mb-1.5">Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@crustpizza.com"
              required
              className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A89E94] mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <Button
            type="submit"
            variant="admin-primary"
            loading={loading}
            className="w-full mt-2"
          >
            Sign In to Admin
          </Button>

          {/* Quick Demo Credentials Autofill button */}
          <div className="pt-2 border-t border-[#4A433C]/60 text-center">
            <button
              type="button"
              onClick={handleUseDemoAdmin}
              className="text-xs text-[#A89E94] hover:text-[#F2B705] transition-colors cursor-pointer"
            >
              Fill Default Demo Admin (admin@crustpizza.com)
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-[#A89E94] mt-6">
          <Link to="/" className="text-[#E4572E] hover:underline">&larr; Return to customer storefront</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
