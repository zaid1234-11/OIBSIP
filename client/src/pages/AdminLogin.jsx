import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function AdminLogin() {
  return (
    <div className="theme-admin min-h-screen flex items-center justify-center px-4 bg-[#14110F] text-[#F6EEDF]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl font-extrabold tracking-[0.18em] text-[#F6EEDF] uppercase">
            CRUST
          </span>
          <span className="ml-2 text-xs font-mono font-bold bg-[#E4572E] text-white px-2 py-0.5 rounded uppercase">
            Admin
          </span>
          <p className="text-sm text-[#A89E94] mt-3">Sign in to access order queue and inventory</p>
        </div>
        <div className="bg-[#2C2621] rounded-[20px] p-7 border border-[#4A433C] space-y-4 shadow-xl">
          {['Admin Email', 'Password'].map(field => (
            <div key={field}>
              <label className="block text-xs font-medium text-[#A89E94] mb-1.5">{field}</label>
              <input
                type={field.includes('Password') ? 'password' : 'text'}
                placeholder={field.includes('Email') ? 'admin@crustpizza.com' : '••••••••'}
                className="w-full h-11 px-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
                disabled
              />
            </div>
          ))}
          <Button variant="admin-primary" className="w-full mt-2">Sign in to Admin</Button>
        </div>
        <p className="text-center text-sm text-[#A89E94] mt-6">
          <Link to="/" className="text-[#E4572E] hover:underline">Back to customer storefront</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
