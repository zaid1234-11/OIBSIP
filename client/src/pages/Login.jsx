import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function Login() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">Welcome Back</h1>
          <p className="text-sm text-[#736254] mt-1.5">Sign in to reorder your saved pizza builds</p>
        </div>
        <div className="bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4">
          {['Email Address', 'Password'].map(field => (
            <div key={field}>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">{field}</label>
              <input
                type={field.includes('Password') ? 'password' : 'email'}
                placeholder={field}
                className="w-full h-11 px-4 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810]"
                disabled
              />
            </div>
          ))}
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-[#E4572E] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button variant="customer-primary" className="w-full mt-2">Sign In</Button>
        </div>
        <p className="text-center text-sm text-[#736254] mt-6">
          Need an account? <Link to="/register" className="font-semibold text-[#E4572E] hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
