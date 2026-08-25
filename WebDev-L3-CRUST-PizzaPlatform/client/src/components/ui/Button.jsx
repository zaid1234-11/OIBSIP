import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  // Theme-adaptive & explicit variants
  primary:
    'bg-[var(--color-tomato,#E4572E)] text-[var(--color-dough-cream,#F6EEDF)] hover:brightness-110 active:brightness-95 shadow-sm',
  secondary:
    'border-2 border-[var(--color-border,#4A433C)] text-[var(--text-primary,#F6EEDF)] hover:border-[var(--text-primary,#F6EEDF)] bg-transparent',
  ghost:
    'text-[var(--text-muted,#A89E94)] hover:text-[var(--text-primary,#F6EEDF)] hover:bg-white/5 bg-transparent',
  
  // Explicit customer variants
  'customer-primary':
    'bg-gradient-to-r from-[#E4572E] to-[#C33C14] text-white hover:brightness-110 shadow-md',
  'customer-secondary':
    'border-2 border-[#DCD0B0] bg-[#FAF6EE] text-[#4A121A] hover:bg-[#F4EDE0] hover:border-[#4A121A]',
  
  // Explicit admin variants
  'admin-primary':
    'bg-[#E4572E] text-[#F6EEDF] hover:brightness-110 active:brightness-95 shadow-sm',
  'admin-ghost':
    'text-[#A89E94] hover:text-[#F6EEDF] hover:bg-white/5 bg-transparent',
};

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      style={{ borderRadius: 'var(--btn-radius, 12px)' }}
      className={`
        inline-flex items-center justify-center gap-2
        font-body font-semibold
        transition-all duration-200 ease-out
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export default Button;
