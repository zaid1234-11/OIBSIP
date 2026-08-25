import React from 'react';
import StatusPill from '../components/ui/StatusPill';

export function Orders() {
  const mockOrders = [
    { code: 'CR-1048', customer: 'Rahul S.', items: 2, total: 748, status: 'kitchen', time: '2:30 PM' },
    { code: 'CR-1047', customer: 'Priya M.', items: 1, total: 399, status: 'out_for_delivery', time: '2:15 PM' },
    { code: 'CR-1046', customer: 'Arjun K.', items: 3, total: 1097, status: 'delivered', time: '1:45 PM' },
    { code: 'CR-1045', customer: 'Meera P.', items: 1, total: 249, status: 'ordered', time: '1:30 PM' },
    { code: 'CR-1044', customer: 'Vikram D.', items: 2, total: 598, status: 'cancelled', time: '12:00 PM' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-dough-cream mb-6">Order queue</h1>

      <div className="flex gap-2 mb-6">
        {['All', 'Ordered', 'Kitchen', 'Delivery', 'Delivered'].map((tab, i) => (
          <button key={tab} className={`px-4 py-2 rounded-pill text-sm font-medium transition-all cursor-pointer ${
            i === 0 ? 'bg-tomato text-dough-cream' : 'bg-charcoal-light text-dough-cream/60 hover:text-dough-cream border border-char-grey/30'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-charcoal-light rounded-card border border-char-grey/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-char-grey/30 text-left text-char-grey">
              <th className="py-3 px-4 font-medium">Order</th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium">Items</th>
              <th className="py-3 px-4 font-medium">Total</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map(o => (
              <tr key={o.code} className="border-b border-char-grey/15 text-dough-cream/80 hover:bg-white/3 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold">{o.code}</td>
                <td className="py-3 px-4">{o.customer}</td>
                <td className="py-3 px-4 font-mono">{o.items}</td>
                <td className="py-3 px-4 font-mono">{'\u20B9'}{o.total}</td>
                <td className="py-3 px-4"><StatusPill status={o.status} /></td>
                <td className="py-3 px-4 font-mono text-char-grey">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
