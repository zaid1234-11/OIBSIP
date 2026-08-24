import React from 'react';
import { Package } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  icon: Icon = Package,
  message = 'Nothing here yet',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-charcoal-light flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-char-grey" />
      </div>
      <p className="text-dough-cream/70 text-base mb-6">{message}</p>
      {actionLabel && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
