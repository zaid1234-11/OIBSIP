import React from 'react';
import StockBadge from '../components/ui/StockBadge';

export function Inventory() {
  const mockIngredients = [
    { name: 'Mozzarella', unit: 'kg', current: 12, min: 5, max: 25, level: 'healthy' },
    { name: 'Pepperoni', unit: 'kg', current: 3, min: 5, max: 20, level: 'low' },
    { name: 'Pizza dough', unit: 'kg', current: 1, min: 5, max: 30, level: 'critical' },
    { name: 'Tomato sauce', unit: 'ml', current: 5000, min: 2000, max: 10000, level: 'healthy' },
    { name: 'Bell peppers', unit: 'kg', current: 2, min: 3, max: 10, level: 'low' },
    { name: 'Fresh basil', unit: 'unit', current: 0, min: 10, max: 50, level: 'critical' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-dough-cream mb-6">Inventory</h1>
      <div className="bg-charcoal-light rounded-card border border-char-grey/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-char-grey/30 text-left text-char-grey">
              <th className="py-3 px-4 font-medium">Ingredient</th>
              <th className="py-3 px-4 font-medium">Current</th>
              <th className="py-3 px-4 font-medium">Min</th>
              <th className="py-3 px-4 font-medium">Max</th>
              <th className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockIngredients.map(ing => (
              <tr key={ing.name} className="border-b border-char-grey/15 text-dough-cream/80 hover:bg-white/3 transition-colors">
                <td className="py-3 px-4 font-medium">{ing.name}</td>
                <td className="py-3 px-4 font-mono">{ing.current} {ing.unit}</td>
                <td className="py-3 px-4 font-mono text-char-grey">{ing.min}</td>
                <td className="py-3 px-4 font-mono text-char-grey">{ing.max}</td>
                <td className="py-3 px-4"><StockBadge level={ing.level} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
