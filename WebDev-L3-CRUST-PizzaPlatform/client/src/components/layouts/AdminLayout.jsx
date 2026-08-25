import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Pizza,
  Users,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/orders',    label: 'Orders',      icon: ClipboardList },
  { to: '/admin/inventory', label: 'Inventory',   icon: Package },
  { to: '/admin/pizzas',    label: 'Pizzas',      icon: Pizza },
  { to: '/admin/customers', label: 'Customers',   icon: Users },
  { to: '/admin/settings',  label: 'Settings',    icon: Settings },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-all duration-200 no-underline ${
      isActive
        ? 'bg-[#E4572E]/15 text-[#E4572E] font-semibold border border-[#E4572E]/30'
        : 'text-[#F6EEDF]/70 hover:text-[#F6EEDF] hover:bg-white/5'
    }`;

  return (
    <div className="theme-admin min-h-screen flex bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-[#14110F] border-r border-[#4A433C]
          flex flex-col z-50 transition-all duration-300 shadow-2xl
          ${collapsed ? 'w-18' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-18 border-b border-[#4A433C]">
          {!collapsed && (
            <Link to="/admin" className="no-underline flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-[0.16em] text-[#F6EEDF] uppercase">
                CRUST
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#E4572E] text-white px-2 py-0.5 rounded uppercase">
                Admin
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-[#A89E94] hover:text-[#F6EEDF] transition-colors cursor-pointer rounded-lg hover:bg-white/5"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <MenuIcon className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClasses}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#4A433C]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium text-[#A89E94] hover:text-[#F6EEDF] hover:bg-white/5 transition-all no-underline"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Storefront</span>}
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-18' : 'ml-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-18 bg-[#1E1A17]/90 backdrop-blur-md border-b border-[#4A433C] flex items-center justify-between px-8">
          <h2 className="text-base font-semibold text-[#F6EEDF] font-body">CRUST Kitchen & Order Management</h2>
          <div className="font-mono text-xs text-[#A89E94]">
            Theme: <span className="text-[#F2B705]">Admin (.theme-admin)</span>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
