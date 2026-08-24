import React from 'react';
import { useParams } from 'react-router-dom';
import TicketCard from '../components/ui/TicketCard';
import Button from '../components/ui/Button';

export function OrderDetail() {
  const { id } = useParams();
  const mock = {
    code: 'CR-' + (id || '1048'),
    items: [
      { name: 'Margherita (M)', quantity: 1, price: 299 },
      { name: 'Pepperoni Feast (L)', quantity: 1, price: 449 },
    ],
    total: 748,
    status: 'kitchen',
    timestamp: '24 Aug 2026, 2:30 PM',
  };

  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs text-char-grey uppercase tracking-wider mb-2">Admin / Order #{id}</p>
      <h1 className="text-3xl font-display font-bold text-dough-cream mb-6">Order detail</h1>

      <TicketCard {...mock} className="mb-6" />

      <div className="flex gap-3">
        <Button variant="primary" size="sm">Advance status</Button>
        <Button variant="ghost" size="sm">Cancel order</Button>
      </div>
    </div>
  );
}

export default OrderDetail;
