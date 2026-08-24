import React from 'react';

const statusConfig = {
  ordered:          { label: 'Ordered',          bg: 'bg-char-grey',   text: 'text-dough-cream' },
  kitchen:          { label: 'Kitchen',          bg: 'bg-mozzarella',  text: 'text-charcoal-ember' },
  out_for_delivery: { label: 'Out for delivery', bg: 'bg-tomato',      text: 'text-dough-cream' },
  delivered:        { label: 'Delivered',         bg: 'bg-basil',       text: 'text-dough-cream' },
  cancelled:        { label: 'Cancelled',         bg: 'bg-char-grey/60', text: 'text-dough-cream/70' },
  pending_payment:  { label: 'Pending payment',  bg: 'bg-mozzarella/60', text: 'text-charcoal-ember' },
};

export function StatusPill({ status, className = '' }) {
  const config = statusConfig[status] || statusConfig.ordered;
  return (
    <span
      className={`
        inline-block font-mono text-xs font-semibold
        px-3 py-1 rounded-pill uppercase tracking-wider
        ${config.bg} ${config.text}
        ${className}
      `}
    >
      {config.label}
    </span>
  );
}

export default StatusPill;
