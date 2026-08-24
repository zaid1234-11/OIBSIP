import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, token, isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !token) {
    if (requireAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="theme-admin min-h-screen flex items-center justify-center p-6 bg-[#14110F] text-[#F6EEDF]">
        <div className="max-w-md w-full bg-[#2C2621] rounded-[20px] p-8 border border-[#E4572E] text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#E4572E]/20 text-[#E4572E] flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-display font-bold text-[#F6EEDF]">403 Forbidden</h1>
          <p className="text-sm text-[#A89E94]">
            Access restricted. Your account ({user?.email}) has role <code className="text-[#F2B705] font-mono font-bold">'{user?.role}'</code>.
            Admin credentials are required to access this portal.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-block px-6 py-2.5 rounded-[12px] bg-[#E4572E] text-[#F6EEDF] font-semibold text-sm no-underline hover:brightness-110"
            >
              Return to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
