import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export function Cart() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mb-8">Your Order Box</h1>
      <div className="bg-white rounded-[20px] p-8 border border-[#E2D6C2] shadow-sm">
        <EmptyState
          icon={ShoppingBag}
          message="Your pizza box is currently empty"
          actionLabel="Build a custom pizza"
          onAction={() => {}}
        />
      </div>
    </div>
  );
}

export default Cart;
