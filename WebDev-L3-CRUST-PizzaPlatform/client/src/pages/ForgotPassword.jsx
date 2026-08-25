import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function ForgotPassword() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      if (response.data?.resetToken) {
        setResetToken(response.data.resetToken);
      }
      addToast('Password reset link generated.', { type: 'info' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-display font-extrabold text-[#4A121A] mb-2">Forgot Password</h1>
        <p className="text-sm text-[#736254] mb-6">Enter your email to receive password recovery instructions</p>

        {submitted ? (
          <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#456B4E]/15 flex items-center justify-center mx-auto text-[#456B4E]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#2C1810]">
              If an account is associated with <strong>{email}</strong>, a recovery link has been generated.
            </p>

            {resetToken && (
              <div className="bg-[#FAF6EE] p-3 rounded-[12px] border border-[#E2D6C2] text-xs text-left space-y-1">
                <span className="font-mono font-bold text-[#E4572E]">Dev Reset Link:</span>
                <Link
                  to={`/reset-password?token=${resetToken}`}
                  className="block text-[#E4572E] underline break-all font-mono"
                >
                  Click to open reset password form &rarr;
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link to="/login">
                <Button variant="customer-secondary" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4 text-left">
            {error && (
              <div className="p-3.5 rounded-[12px] bg-[#E4572E]/10 border border-[#E4572E]/30 text-xs font-semibold text-[#C33C14]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              Send Reset Link
            </Button>
          </form>
        )}

        <p className="text-sm text-[#736254] mt-6">
          <Link to="/login" className="font-semibold text-[#E4572E] hover:underline">&larr; Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
