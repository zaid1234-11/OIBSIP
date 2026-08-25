import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const { user, setUser } = useAuthStore();
  const { addToast } = useToast();

  const [token, setToken] = useState(tokenFromUrl);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (tokenToUse) => {
    const raw = (tokenToUse || token).trim();
    if (!raw) {
      setError('Please provide a verification token.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-email', { token: raw });
      setSuccess(true);
      if (user) {
        setUser({ ...user, isEmailVerified: true });
      }
      addToast('Email verified successfully!', { type: 'success' });
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed or token expired.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenFromUrl) {
      handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md w-full bg-white rounded-[24px] p-8 border border-[#E2D6C2] shadow-sm space-y-6">
        {success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#456B4E]/15 flex items-center justify-center mx-auto text-[#456B4E]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">Email Verified!</h1>
              <p className="text-sm text-[#736254] mt-2">
                Your email address has been successfully verified. You can now build, order, and track pizzas in real time.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/">
                <Button variant="customer-primary" className="w-full">
                  Start Ordering Pizzas
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] flex items-center justify-center mx-auto text-[#E4572E]">
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle className="w-8 h-8" />}
            </div>

            <div>
              <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">Verify Your Email</h1>
              <p className="text-sm text-[#736254] mt-2 leading-relaxed">
                Click below to verify your account with the token from your email.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-[12px] bg-[#E4572E]/10 border border-[#E4572E]/30 text-xs font-semibold text-[#C33C14] text-left">
                {error}
              </div>
            )}

            <div className="space-y-3 text-left">
              <label className="block text-xs font-mono font-medium text-[#736254] uppercase">Verification Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here if not in URL"
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-xs font-mono text-[#2C1810]"
              />
            </div>

            <Button
              variant="customer-primary"
              onClick={() => handleVerify(token)}
              loading={loading}
              className="w-full"
            >
              Verify My Email
            </Button>

            <p className="text-xs text-[#736254]">
              <Link to="/" className="text-[#E4572E] hover:underline">&larr; Return to Storefront</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
