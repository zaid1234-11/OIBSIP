import React from 'react';

export function Customers() {
  const mockCustomers = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', orders: 8, joined: 'Jan 2026' },
    { name: 'Priya Mehta', email: 'priya@example.com', orders: 3, joined: 'Mar 2026' },
    { name: 'Arjun Kumar', email: 'arjun@example.com', orders: 12, joined: 'Dec 2025' },
    { name: 'Meera Patel', email: 'meera@example.com', orders: 1, joined: 'Aug 2026' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-dough-cream mb-6">Customers</h1>
      <div className="bg-charcoal-light rounded-card border border-char-grey/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-char-grey/30 text-left text-char-grey">
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Email</th>
              <th className="py-3 px-4 font-medium">Orders</th>
              <th className="py-3 px-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map(c => (
              <tr key={c.email} className="border-b border-char-grey/15 text-dough-cream/80 hover:bg-white/3 transition-colors">
                <td className="py-3 px-4 font-medium">{c.name}</td>
                <td className="py-3 px-4 font-mono text-xs">{c.email}</td>
                <td className="py-3 px-4 font-mono">{c.orders}</td>
                <td className="py-3 px-4 text-char-grey">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
