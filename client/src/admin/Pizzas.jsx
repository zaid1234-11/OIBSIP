import React from 'react';
import Button from '../components/ui/Button';

export function Pizzas() {
  const mockPizzas = [
    { name: 'Margherita', category: 'veg', price: 249, available: true },
    { name: 'Pepperoni Feast', category: 'non-veg', price: 399, available: true },
    { name: 'BBQ Chicken', category: 'non-veg', price: 449, available: false },
    { name: 'Farm Fresh', category: 'veg', price: 349, available: true },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-dough-cream">Pizzas</h1>
        <Button variant="primary" size="sm">Add pizza</Button>
      </div>
      <div className="bg-charcoal-light rounded-card border border-char-grey/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-char-grey/30 text-left text-char-grey">
              <th className="py-3 px-4 font-medium">Name</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium">Price</th>
              <th className="py-3 px-4 font-medium">Available</th>
              <th className="py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPizzas.map(p => (
              <tr key={p.name} className="border-b border-char-grey/15 text-dough-cream/80 hover:bg-white/3 transition-colors">
                <td className="py-3 px-4 font-medium">{p.name}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${p.category === 'veg' ? 'bg-basil' : 'bg-tomato'}`} />
                    {p.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">{'\u20B9'}{p.price}</td>
                <td className="py-3 px-4">{p.available ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pizzas;
