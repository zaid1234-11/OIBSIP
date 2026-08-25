import React from 'react';

export function Dashboard() {
  const stats = [
    { label: "Today's orders", value: '24', mono: true },
    { label: 'Revenue', value: '\u20B918,420', mono: true },
    { label: 'Customers', value: '142', mono: true },
    { label: 'Low stock items', value: '3', mono: true, highlight: true },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-dough-cream mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-charcoal-light rounded-card p-5 border border-char-grey/20">
            <p className="text-xs font-medium text-char-grey uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.mono ? 'font-mono' : ''} ${s.highlight ? 'text-mozzarella' : 'text-dough-cream'}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders placeholder */}
      <div className="bg-charcoal-light rounded-card p-6 border border-char-grey/20">
        <h2 className="text-xl font-display font-bold text-dough-cream mb-4">Recent orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-char-grey/30 text-left text-char-grey">
                <th className="py-3 px-2 font-medium">Order</th>
                <th className="py-3 px-2 font-medium">Customer</th>
                <th className="py-3 px-2 font-medium">Items</th>
                <th className="py-3 px-2 font-medium">Total</th>
                <th className="py-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-dough-cream/80">
              {[
                { code: 'CR-1048', customer: 'Rahul S.', items: 2, total: 748, status: 'Kitchen' },
                { code: 'CR-1047', customer: 'Priya M.', items: 1, total: 399, status: 'Out for delivery' },
                { code: 'CR-1046', customer: 'Arjun K.', items: 3, total: 1097, status: 'Delivered' },
              ].map(o => (
                <tr key={o.code} className="border-b border-char-grey/15 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-2 font-mono font-semibold">{o.code}</td>
                  <td className="py-3 px-2">{o.customer}</td>
                  <td className="py-3 px-2 font-mono">{o.items}</td>
                  <td className="py-3 px-2 font-mono">{'\u20B9'}{o.total}</td>
                  <td className="py-3 px-2 font-mono text-xs">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
