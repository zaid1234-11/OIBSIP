import React from 'react';
import { ClipboardList } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export function Orders() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mb-8">Order History</h1>
      <div className="bg-white rounded-[20px] p-8 border border-[#E2D6C2] shadow-sm">
        <EmptyState
          icon={ClipboardList}
          message="You haven't placed any orders yet"
          actionLabel="Order your first pizza"
          onAction={() => {}}
        />
      </div>
    </div>
  );
}

export default Orders;
