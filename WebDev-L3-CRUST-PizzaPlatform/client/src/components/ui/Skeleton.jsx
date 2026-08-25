import React from 'react';

export function Skeleton({ variant = 'text', width, height, className = '' }) {
  const base = 'skeleton-shimmer rounded-button';

  if (variant === 'circle') {
    return (
      <div
        className={`${base} rounded-full ${className}`}
        style={{ width: width || 48, height: height || 48 }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`${base} rounded-card ${className}`}
        style={{ width: width || '100%', height: height || 200 }}
      />
    );
  }

  /* text (default) */
  return (
    <div
      className={`${base} ${className}`}
      style={{ width: width || '100%', height: height || 16 }}
    />
  );
}

/* Pre-composed menu card skeleton */
export function MenuCardSkeleton() {
  return (
    <div className="bg-charcoal-light rounded-card p-4 space-y-3">
      <Skeleton variant="card" height={160} />
      <Skeleton variant="text" width="70%" height={20} />
      <Skeleton variant="text" width="40%" height={14} />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" width={60} height={24} />
        <Skeleton variant="text" width={100} height={36} className="rounded-button" />
      </div>
    </div>
  );
}

/* Pre-composed order queue skeleton */
export function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-char-grey/30">
      <Skeleton variant="text" width={80} height={18} />
      <Skeleton variant="text" width={120} height={18} className="flex-1" />
      <Skeleton variant="text" width={80} height={24} className="rounded-pill" />
      <Skeleton variant="text" width={60} height={18} />
    </div>
  );
}

export default Skeleton;
