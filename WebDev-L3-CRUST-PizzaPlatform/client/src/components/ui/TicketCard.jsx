import React from 'react';
import StatusPill from './StatusPill';

export function TicketCard({ code, items = [], total, status, timestamp, className = '' }) {
  return (
    <div
      className={`
        bg-dough-cream text-charcoal-ember
        rounded-card shadow-card
        border border-cream-border
        overflow-hidden
        ${className}
      `}
    >
      {/* Ticket header */}
      <div className="px-6 pt-5 pb-4 flex justify-between items-start">
        <div>
          <p className="font-mono text-xs font-semibold text-char-grey uppercase tracking-wider">
            Order Ticket
          </p>
          <p className="font-mono text-lg font-bold mt-1">{code}</p>
        </div>
        <StatusPill status={status} />
      </div>

      {/* Dashed perforation */}
      <div className="ticket-perforation mx-4" />

      {/* Items list */}
      <div className="px-6 py-4 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span className="font-mono font-semibold">
              {'\u20B9'}{item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="ticket-perforation mx-4" />
      <div className="px-6 py-4 flex justify-between items-center">
        <span className="text-xs text-char-grey font-mono">{timestamp}</span>
        <div className="text-right">
          <p className="text-xs text-char-grey uppercase tracking-wider">Total</p>
          <p className="font-mono text-xl font-bold text-tomato">
            {'\u20B9'}{total?.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
