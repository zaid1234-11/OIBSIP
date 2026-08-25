import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

export function CustomerLayout() {
  return (
    <div className="theme-customer min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--color-border,#E2D6C2)] py-8 px-4 text-center bg-[#F4EDE0]/50 mt-12">
        <p className="font-display font-bold text-base text-[#4A121A] tracking-wider uppercase">
          CRUST
        </p>
        <p className="font-mono text-xs text-[#736254] mt-1">
          Custom Pizza Ordering Platform &bull; Handcrafted Daily
        </p>
      </footer>
    </div>
  );
}

export default CustomerLayout;
