import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export function VerifyEmail() {
  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#456B4E]/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-[#456B4E]" />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-[#4A121A] mb-2">Verify Your Email</h1>
        <p className="text-sm text-[#736254] mb-8 leading-relaxed">
          We sent a verification link to your email address. Click the link to complete account setup.
        </p>
        <Link to="/login">
          <Button variant="customer-secondary">Return to Sign In</Button>
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;
