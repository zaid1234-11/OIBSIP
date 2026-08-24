import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function Register() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">Create Account</h1>
          <p className="text-sm text-[#736254] mt-1.5">Join CRUST for instant live oven tracking</p>
        </div>
        <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4">
          {['Full Name', 'Email Address', 'Password', 'Confirm Password'].map(field => (
            <div key={field}>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">{field}</label>
              <input
                type={field.includes('Password') ? 'password' : 'text'}
                placeholder={field}
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
                disabled
              />
            </div>
          ))}
          <Button variant="customer-primary" className="w-full mt-2">Create Account</Button>
        </div>
        <p className="text-center text-sm text-[#736254] mt-6">
          Already have an account? <Link to="/login" className="font-semibold text-[#E4572E] hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
