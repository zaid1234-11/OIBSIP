import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const tokenFromUrl = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim() || !newPassword) {
      setError('Please provide the token and new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', {
        token: token.trim(),
        newPassword
      });

      setSuccess(true);
      addToast('Password reset successful! You can now sign in.', { type: 'success' });
    } catch (err) {
      setError(err.response?.data?.error || 'Password reset failed or token expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-display font-extrabold text-[#4A121A] mb-2">Create New Password</h1>
        <p className="text-sm text-[#736254] mb-6">Choose a secure password for your account</p>

        {success ? (
          <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#456B4E]/15 flex items-center justify-center mx-auto text-[#456B4E]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#4A121A]">Password Changed</h2>
            <p className="text-sm text-[#736254]">
              Your password has been successfully updated.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="customer-primary" className="w-full">
                  Sign In Now
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
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Reset Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Reset token from email link"
                required
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-xs font-mono text-[#2C1810]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
              />
            </div>

            <Button
              type="submit"
              variant="customer-primary"
              loading={loading}
              className="w-full mt-2"
            >
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
