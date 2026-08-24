import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';

export function Cart() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, loading, fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const deliveryFee = subtotal >= 1000 ? 0 : (items.length > 0 ? 40 : 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + deliveryFee + tax;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">Sign In to View Cart</h2>
        <p className="text-sm text-[#736254] mt-2">Please log in to see your saved items and build queue.</p>
        <Link to="/login" state={{ from: { pathname: '/cart' } }} className="mt-5 inline-block">
          <Button variant="customer-primary">Sign In &rarr;</Button>
        </Link>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <Skeleton variant="card" className="h-28 w-full rounded-[20px]" />
        <Skeleton variant="card" className="h-28 w-full rounded-[20px]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <EmptyState
          icon="🍕"
          title="Nothing here yet"
          description="Your pizza box is currently empty. Fire up our architectural pizza builder and craft your pie."
          actionText="Build a Pizza"
          actionHref="/build-your-pizza"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <span className="font-mono text-xs font-semibold text-[#E4572E] uppercase tracking-wider">
            Order Review
          </span>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mt-1">Your Pizza Box</h1>
          <p className="text-sm text-[#736254] mt-1">
            {items.length} unique {items.length === 1 ? 'item' : 'items'} prepared for the wood-fired ovens.
          </p>
        </div>
        <Button variant="customer-ghost" size="sm" onClick={clearCart} className="text-[#C33C14] hover:bg-[#E4572E]/10">
          <Trash2 className="w-4 h-4 mr-1" /> Empty Box
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="pt-4 flex justify-between items-center">
            <Link to="/menu" className="text-sm font-semibold text-[#E4572E] hover:underline">
              &larr; Add more from Menu
            </Link>
            <Link to="/build-your-pizza" className="text-sm font-semibold text-[#4A121A] hover:underline">
              + Custom Build Another Pie
            </Link>
          </div>
        </div>

        {/* Order Summary Stub (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[#FAF6EE] rounded-[24px] p-6 sm:p-7 border border-[#E2D6C2] shadow-md space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-[#DCD0B0]">
              <span className="font-display font-bold text-lg text-[#4A121A]">Ticket Summary</span>
              <span className="font-mono text-xs font-bold text-[#E4572E] bg-white px-2.5 py-1 rounded-full border border-[#E2D6C2]">
                SERVER VERIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#2C1810]">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#736254]">
                <span>Wood-Fired Delivery</span>
                <span className="font-mono font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#456B4E]">FREE (Order &gt; ₹1000)</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[#736254]">
                <span>GST / Taxes (5%)</span>
                <span className="font-mono font-semibold">₹{tax}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DCD0B0] flex justify-between items-baseline">
              <div>
                <span className="font-display font-bold text-lg text-[#4A121A] block">Estimated Total</span>
                <span className="text-[11px] text-[#736254]">Final price locked at checkout</span>
              </div>
              <span className="font-mono text-3xl font-extrabold text-[#E4572E]">
                ₹{grandTotal}
              </span>
            </div>

            <Button
              variant="customer-primary"
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full mt-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
