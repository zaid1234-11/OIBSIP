import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { useToast } from '../ui/Toast';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const itemCount = (cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { to: '/menu', label: 'Menu' },
    { to: '/build-your-pizza', label: 'Build Pizza' },
    { to: '/orders', label: 'My Orders' },
  ];

  const linkClasses = ({ isActive }) =>
    `font-body text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-[#E4572E]'
        : 'text-[#4A121A]/80 hover:text-[#4A121A]'
    }`;

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully.', { type: 'info' });
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#E2D6C2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Wordmark */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="relative font-display text-2xl sm:text-3xl font-extrabold tracking-[0.18em] text-[#4A121A] uppercase">
              CRUST
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#E4572E] rounded-full" />
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-[#4A121A] hover:bg-[#F4EDE0] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E4572E] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCD0B0] bg-[#F4EDE0] text-sm font-semibold text-[#4A121A] hover:bg-[#EAE0CE] transition-all no-underline shadow-sm"
                >
                  <User className="w-4 h-4 text-[#E4572E]" />
                  <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
                  {isAdmin && (
                    <span className="text-[10px] font-mono font-bold bg-[#E4572E] text-white px-1.5 py-0.2 rounded">
                      Admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-[#736254] hover:text-[#4A121A] hover:bg-[#F4EDE0] transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#DCD0B0] bg-[#F4EDE0] text-sm font-semibold text-[#4A121A] hover:bg-[#EAE0CE] transition-all no-underline shadow-sm"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#4A121A] hover:bg-[#F4EDE0] rounded-full cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2D6C2] bg-[#FAF6EE] px-6 py-4 space-y-3 shadow-lg">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
              onClick={() => setMobileOpen(false)}
            >
              <div className="py-2">{link.label}</div>
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={linkClasses}
                onClick={() => setMobileOpen(false)}
              >
                <div className="py-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile ({user?.name})
                </div>
              </NavLink>
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="w-full text-left py-2 text-sm font-semibold text-[#E4572E] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={linkClasses}
              onClick={() => setMobileOpen(false)}
            >
              <div className="py-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Login
              </div>
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
