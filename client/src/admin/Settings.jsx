import React from 'react';
import Button from '../components/ui/Button';

export function Settings() {
  const fields = [
    { label: 'Delivery fee', value: '\u20B949', unit: 'per order' },
    { label: 'Tax rate', value: '5', unit: '%' },
    { label: 'Low stock threshold', value: '5', unit: 'units' },
  ];

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-display font-bold text-dough-cream mb-6">Settings</h1>
      <div className="bg-charcoal-light rounded-card p-6 border border-char-grey/20 space-y-5">
        {fields.map(f => (
          <div key={f.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dough-cream">{f.label}</p>
              <p className="text-xs text-char-grey">{f.unit}</p>
            </div>
            <div className="w-24 h-10 rounded-button bg-charcoal-ember border border-char-grey/30 flex items-center justify-center font-mono text-sm text-dough-cream/80">
              {f.value}
            </div>
          </div>
        ))}
        <Button variant="primary" disabled>Save settings</Button>
      </div>
    </div>
  );
}

export default Settings;
