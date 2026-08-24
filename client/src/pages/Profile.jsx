import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, ShieldCheck, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully.', { type: 'info' });
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A]">Your Profile</h1>
          <p className="text-sm text-[#736254] mt-1">Manage your account details and delivery addresses</p>
        </div>
        <Button variant="customer-secondary" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>

      <div className="bg-white rounded-[24px] p-8 border border-[#E2D6C2] shadow-sm space-y-8">
        {/* User Card */}
        <div className="flex items-center gap-5 pb-6 border-b border-[#F4EDE0]">
          <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border-2 border-[#E2D6C2] flex items-center justify-center text-[#E4572E]">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display font-bold text-[#2C1810]">{user?.name || 'Customer'}</h2>
              <span className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full uppercase ${
                user?.role === 'admin'
                  ? 'bg-[#E4572E] text-white'
                  : 'bg-[#E8DCBE] text-[#4A121A]'
              }`}>
                {user?.role || 'customer'}
              </span>
            </div>
            <p className="text-sm text-[#736254] mt-1">{user?.email}</p>
          </div>
        </div>

        {/* Email Verification Status */}
        <div className="p-4 rounded-[16px] bg-[#FAF6EE] border border-[#E2D6C2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.isEmailVerified ? (
              <CheckCircle className="w-5 h-5 text-[#456B4E]" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#F2B705]" />
            )}
            <div>
              <p className="text-sm font-semibold text-[#2C1810]">
                {user?.isEmailVerified ? 'Email is Verified' : 'Email is Unverified'}
              </p>
              <p className="text-xs text-[#736254]">
                {user?.isEmailVerified
                  ? 'Your account has full access to ordering and notifications.'
                  : 'Please verify your email to unlock seamless order updates.'}
              </p>
            </div>
          </div>
          {!user?.isEmailVerified && (
            <Link to="/verify-email">
              <Button variant="customer-secondary" size="sm">Verify Now</Button>
            </Link>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-[#4A121A]">Saved Delivery Addresses</h3>
            <Button variant="customer-secondary" size="sm" disabled>+ Add Address</Button>
          </div>
          {user?.addresses && user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((addr, idx) => (
                <div key={idx} className="p-4 rounded-[16px] bg-[#FAF6EE] border border-[#E2D6C2] text-sm">
                  <span className="font-mono font-bold text-xs uppercase text-[#E4572E]">{addr.label || 'Home'}</span>
                  <p className="mt-1 font-medium text-[#2C1810]">{addr.street}, {addr.city} - {addr.pin}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#736254] italic">No saved delivery addresses yet. Add one during checkout.</p>
          )}
        </div>

        {user?.role === 'admin' && (
          <div className="pt-4 border-t border-[#F4EDE0]">
            <Link to="/admin">
              <Button variant="customer-primary" size="md" className="w-full">
                Open Admin Management Dashboard &rarr;
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
