import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const { user, token, verificationToken } = response.data;
      login(user, token);
      setRegisteredUser({ ...user, verificationToken });

      addToast('Account created! Please verify your email.', { type: 'success' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredUser) {
    return (
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-[24px] p-8 border border-[#E2D6C2] shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#456B4E]/15 flex items-center justify-center mx-auto text-[#456B4E]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-[#4A121A]">Verify Your Email</h1>
            <p className="text-sm text-[#736254] mt-2">
              We sent a verification link to <strong className="text-[#2C1810]">{registeredUser.email}</strong>.
            </p>
          </div>

          <div className="bg-[#FAF6EE] p-4 rounded-[16px] border border-[#E2D6C2] text-xs text-[#736254] text-left space-y-2">
            <div className="font-mono font-bold text-[#4A121A] uppercase">Development Helper:</div>
            <p>During local testing, you can verify your email directly using this token:</p>
            <div className="font-mono font-semibold text-[#E4572E] break-all bg-white p-2 rounded border border-[#E2D6C2]">
              {registeredUser.verificationToken}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link to={`/verify-email?token=${registeredUser.verificationToken}`}>
              <Button variant="customer-primary" className="w-full">
                Verify Email Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="customer-secondary" className="w-full">
                Go to Menu (Unverified)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">Create Account</h1>
          <p className="text-sm text-[#736254] mt-1.5">Join CRUST for instant live oven tracking</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-7 sm:p-8 border border-[#E2D6C2] shadow-sm space-y-4">
          {error && (
            <div className="p-3.5 rounded-[12px] bg-[#E4572E]/10 border border-[#E4572E]/30 text-xs font-semibold text-[#C33C14]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              required
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
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
              placeholder="At least 6 characters"
              required
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <Button
            type="submit"
            variant="customer-primary"
            loading={loading}
            className="w-full mt-2"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-[#736254] mt-6">
          Already have an account? <Link to="/login" className="font-semibold text-[#E4572E] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
