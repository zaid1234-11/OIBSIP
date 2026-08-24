import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function ForgotPassword() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-display font-extrabold text-[#4A121A] mb-2">Reset Password</h1>
        <p className="text-sm text-[#736254] mb-6">Enter your registered email to receive a recovery link</p>
        <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
              disabled
            />
          </div>
          <Button variant="customer-primary" className="w-full mt-2">Send Recovery Link</Button>
        </div>
        <p className="text-sm text-[#736254] mt-6">
          <Link to="/login" className="font-semibold text-[#E4572E] hover:underline">&larr; Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
