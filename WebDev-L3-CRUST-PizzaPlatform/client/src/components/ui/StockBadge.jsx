import React from 'react';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

const levelConfig = {
  healthy:  { label: 'Healthy',  bg: 'bg-basil/15',     text: 'text-basil',     border: 'border-basil/30',     Icon: TrendingUp },
  low:      { label: 'Low stock', bg: 'bg-mozzarella/15', text: 'text-mozzarella', border: 'border-mozzarella/30', Icon: AlertTriangle },
  critical: { label: 'Critical',  bg: 'bg-tomato/15',    text: 'text-tomato',    border: 'border-tomato/30',    Icon: AlertCircle },
};

export function StockBadge({ level = 'healthy', className = '' }) {
  const config = levelConfig[level] || levelConfig.healthy;
  const { Icon } = config;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-mono text-xs font-semibold
        px-3 py-1 rounded-pill
        border ${config.bg} ${config.text} ${config.border}
        ${className}
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

export default StockBadge;
