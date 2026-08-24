import React from 'react';
import Button from '../components/ui/Button';

export function ResetPassword() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-display font-extrabold text-[#4A121A] mb-2">New Password</h1>
        <p className="text-sm text-[#736254] mb-6">Create a secure password for your CRUST account</p>
        <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4 text-left">
          {['New Password', 'Confirm New Password'].map(field => (
            <div key={field}>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">{field}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
                disabled
              />
            </div>
          ))}
          <Button variant="customer-primary" className="w-full mt-2">Save New Password</Button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
