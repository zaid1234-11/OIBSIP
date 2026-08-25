import React from 'react';
import { ShoppingBag, Package, ClipboardList, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import StatusPill from '../components/ui/StatusPill';
import TicketCard from '../components/ui/TicketCard';
import StockBadge from '../components/ui/StockBadge';
import { Toast } from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';
import Skeleton, { MenuCardSkeleton, OrderRowSkeleton } from '../components/ui/Skeleton';
import BuildShot from '../components/ui/BuildShot';

export function StyleGuide() {
  const mockTicket = {
    code: 'CR-1048',
    items: [
      { name: 'Margherita Classica (10")', quantity: 1, price: 299 },
      { name: 'Rustic Pepperoni (12")', quantity: 1, price: 449 },
    ],
    total: 748,
    status: 'kitchen',
    timestamp: '24 Aug 2026, 2:30 PM',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <header className="border-b border-[#E2D6C2] pb-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-4xl font-extrabold text-[#4A121A]">CRUST</span>
          <span className="font-mono text-xs font-bold px-3 py-1 bg-[#E4572E] text-white rounded-full uppercase tracking-wider">
            Dual-Theme System
          </span>
        </div>
        <p className="text-sm text-[#736254] mt-2 font-mono">
          Living Component & Token Reference &bull; Customer Theme (.theme-customer) vs Admin Theme (.theme-admin)
        </p>
      </header>

      {/* ============================================================
          SECTION 1: CUSTOMER THEME (.theme-customer)
          ============================================================ */}
      <section className="theme-customer bg-[#FAF6EE] p-8 sm:p-10 rounded-[24px] border-2 border-[#E8DCBE] shadow-lg space-y-12">
        <div className="flex items-center justify-between border-b border-[#E2D6C2] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#E4572E] uppercase tracking-wider">Environment 01</span>
            <h2 className="text-3xl font-display font-extrabold text-[#4A121A] mt-0.5">Customer Theme</h2>
          </div>
          <span className="text-xs font-mono bg-white px-3 py-1 rounded-full border border-[#E2D6C2] text-[#736254]">
            class: .theme-customer
          </span>
        </div>

        {/* Customer Colors */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">Color Palette & Tokens</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'cream-base', hex: '#FAF6EE', bg: 'bg-[#FAF6EE]', border: 'border-[#DCD0B0]', text: 'text-[#2C1810]' },
              { name: 'oxblood', hex: '#4A121A', bg: 'bg-[#4A121A]', border: 'border-transparent', text: 'text-white' },
              { name: 'ember', hex: '#E4572E', bg: 'bg-[#E4572E]', border: 'border-transparent', text: 'text-white' },
              { name: 'ember-deep', hex: '#C33C14', bg: 'bg-[#C33C14]', border: 'border-transparent', text: 'text-white' },
              { name: 'basil', hex: '#456B4E', bg: 'bg-[#456B4E]', border: 'border-transparent', text: 'text-white' },
              { name: 'sesame', hex: '#E8DCBE', bg: 'bg-[#E8DCBE]', border: 'border-[#DCD0B0]', text: 'text-[#2C1810]' },
            ].map(c => (
              <div key={c.name} className="text-center bg-white p-3 rounded-[16px] border border-[#E2D6C2] shadow-sm">
                <div className={`w-full h-16 rounded-[12px] ${c.bg} ${c.border} border flex items-center justify-center`}>
                  <span className={`text-xs font-mono font-bold ${c.text}`}>{c.hex}</span>
                </div>
                <p className="text-xs font-mono font-bold mt-2 text-[#4A121A]">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Typography */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">Typography Stack</h3>
          <div className="space-y-3 bg-white p-6 rounded-[20px] border border-[#E2D6C2] shadow-sm">
            <div>
              <span className="text-xs font-mono text-[#736254] uppercase tracking-wider">Display / Titles &bull; Fraunces</span>
              <p className="text-3xl font-display font-extrabold text-[#4A121A]">Build the pizza you actually want.</p>
            </div>
            <div className="pt-2 border-t border-[#F4EDE0]">
              <span className="text-xs font-mono text-[#736254] uppercase tracking-wider">Body / UI &bull; Inter</span>
              <p className="text-sm font-body text-[#2C1810]">Hand-stretched 48-hour fermented sourdough crusts with fresh San Marzano tomatoes.</p>
            </div>
            <div className="pt-2 border-t border-[#F4EDE0]">
              <span className="text-xs font-mono text-[#736254] uppercase tracking-wider">Data / Numbers &bull; IBM Plex Mono</span>
              <p className="text-sm font-mono font-bold text-[#E4572E]">TICKET #CR-1048 &bull; TOTAL {'\u20B9'}748.00</p>
            </div>
          </div>
        </div>

        {/* Customer Buttons */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">Customer Buttons (Pill Radius &bull; Ember Gradient)</h3>
          <div className="space-y-4 bg-white p-6 rounded-[20px] border border-[#E2D6C2] shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="customer-primary" size="sm">Primary Small</Button>
              <Button variant="customer-primary" size="md">Primary Medium</Button>
              <Button variant="customer-primary" size="lg">Primary Large (Ember)</Button>
              <Button variant="customer-secondary" size="md">Secondary (Sesame)</Button>
              <Button variant="customer-primary" size="md" loading>Loading</Button>
              <Button variant="customer-primary" size="md" disabled>Disabled</Button>
            </div>
          </div>
        </div>

        {/* BuildShot Visual Preview Component */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">BuildShot Component (Pizza Builder Preview)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BuildShot size="medium" />
            <div className="bg-white p-6 rounded-[20px] border border-[#E2D6C2] shadow-sm flex flex-col justify-center">
              <h4 className="font-display font-bold text-base text-[#4A121A] mb-2">Live Architectural Preview</h4>
              <p className="text-xs text-[#736254] leading-relaxed">
                Renders SVG/canvas layers for dough crust, sauce coverage, melted cheese blends, and placed toppings. Prepares for Phase 4 real-time interactive compositing.
              </p>
            </div>
          </div>
        </div>

        {/* Customer StatusPills (All 6 orderStatus values) */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">StatusPill Component (All 6 Order Statuses)</h3>
          <div className="flex flex-wrap gap-3 bg-white p-6 rounded-[20px] border border-[#E2D6C2] shadow-sm">
            {['pending_payment', 'ordered', 'kitchen', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
              <StatusPill key={status} status={status} />
            ))}
          </div>
        </div>

        {/* Customer EmptyState & Toasts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">EmptyState Component</h3>
            <div className="bg-white rounded-[20px] border border-[#E2D6C2] shadow-sm">
              <EmptyState icon={ShoppingBag} message="Nothing in your order box yet" actionLabel="Build a custom pizza" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-[#4A121A] mb-4">Active-Voice Toasts</h3>
            <div className="space-y-3">
              <Toast message="Added to cart" type="info" />
              <Toast message="Order placed into kitchen queue" type="success" />
              <Toast message="Pepperoni is running low on stock" type="warning" />
              <Toast message="Payment verification timed out, please retry" type="error" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: ADMIN THEME (.theme-admin)
          ============================================================ */}
      <section className="theme-admin bg-[#1E1A17] p-8 sm:p-10 rounded-[24px] border-2 border-[#4A433C] shadow-2xl text-[#F6EEDF] space-y-12">
        <div className="flex items-center justify-between border-b border-[#4A433C] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#E4572E] uppercase tracking-wider">Environment 02</span>
            <h2 className="text-3xl font-display font-extrabold text-[#F6EEDF] mt-0.5">Admin Theme</h2>
          </div>
          <span className="text-xs font-mono bg-[#2C2621] px-3 py-1 rounded-full border border-[#4A433C] text-[#A89E94]">
            class: .theme-admin
          </span>
        </div>

        {/* Admin Colors */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#F6EEDF] mb-4">Color Palette & Tokens</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'charcoal-ember', hex: '#1E1A17', bg: 'bg-[#1E1A17]', border: 'border-[#4A433C]', text: 'text-[#F6EEDF]' },
              { name: 'dough-cream', hex: '#F6EEDF', bg: 'bg-[#F6EEDF]', border: 'border-transparent', text: 'text-[#1E1A17]' },
              { name: 'tomato', hex: '#E4572E', bg: 'bg-[#E4572E]', border: 'border-transparent', text: 'text-white' },
              { name: 'mozzarella', hex: '#F2B705', bg: 'bg-[#F2B705]', border: 'border-transparent', text: 'text-[#1E1A17]' },
              { name: 'basil', hex: '#456B4E', bg: 'bg-[#456B4E]', border: 'border-transparent', text: 'text-white' },
              { name: 'char-grey', hex: '#4A433C', bg: 'bg-[#4A433C]', border: 'border-transparent', text: 'text-[#F6EEDF]' },
            ].map(c => (
              <div key={c.name} className="text-center bg-[#2C2621] p-3 rounded-[16px] border border-[#4A433C] shadow-sm">
                <div className={`w-full h-16 rounded-[12px] ${c.bg} ${c.border} border flex items-center justify-center`}>
                  <span className={`text-xs font-mono font-bold ${c.text}`}>{c.hex}</span>
                </div>
                <p className="text-xs font-mono font-bold mt-2 text-[#F6EEDF]">{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Buttons */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#F6EEDF] mb-4">Admin Buttons (12px Radius &bull; Solid Tomato / Ghost)</h3>
          <div className="space-y-4 bg-[#2C2621] p-6 rounded-[20px] border border-[#4A433C] shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="admin-primary" size="sm">Primary Small</Button>
              <Button variant="admin-primary" size="md">Primary Medium (Tomato)</Button>
              <Button variant="admin-primary" size="lg">Primary Large</Button>
              <Button variant="admin-ghost" size="md">Ghost Action</Button>
              <Button variant="admin-primary" size="md" loading>Loading</Button>
              <Button variant="admin-primary" size="md" disabled>Disabled</Button>
            </div>
          </div>
        </div>

        {/* TicketCard Component */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#F6EEDF] mb-4">Signature TicketCard Component</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TicketCard {...mockTicket} />
            <TicketCard
              code="CR-1049"
              items={[
                { name: 'Tuscan Garden (10")', quantity: 1, price: 379 },
                { name: 'Quattro Formaggi (12")', quantity: 1, price: 499 }
              ]}
              total={878}
              status="pending_payment"
              timestamp="24 Aug 2026, 2:45 PM"
            />
          </div>
        </div>

        {/* StockBadge Component */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#F6EEDF] mb-4">StockBadge Component (Inventory Indicators)</h3>
          <div className="flex flex-wrap gap-4 bg-[#2C2621] p-6 rounded-[20px] border border-[#4A433C]">
            <StockBadge level="healthy" />
            <StockBadge level="low" />
            <StockBadge level="critical" />
          </div>
        </div>

        {/* Admin Skeletons */}
        <div>
          <h3 className="text-lg font-display font-bold text-[#F6EEDF] mb-4">Admin Queue Skeletons</h3>
          <div className="bg-[#2C2621] rounded-[20px] border border-[#4A433C] p-4 space-y-2">
            <OrderRowSkeleton />
            <OrderRowSkeleton />
            <OrderRowSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}

export default StyleGuide;
