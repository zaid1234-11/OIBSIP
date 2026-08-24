import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Checkout() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  const [address, setAddress] = useState({
    street: '42 Woodfire Boulevard, Bandra West',
    city: 'Mumbai',
    pin: '400050'
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const deliveryFee = subtotal >= 1000 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + tax;

  if (items.length === 0 && !placing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">Your Cart is Empty</h2>
        <p className="text-sm text-[#736254] mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link to="/menu" className="mt-4 inline-block">
          <Button variant="customer-primary">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street.trim() || !address.city.trim() || !address.pin.trim()) {
      setError('Please provide a complete delivery address.');
      return;
    }

    setPlacing(true);
    setError('');

    try {
      const response = await api.post('/orders', {
        deliveryAddress: address
      });

      const createdOrder = response.data.order;
      addToast(`Order ${createdOrder.orderCode} placed successfully!`, { type: 'success' });
      navigate(`/order/${createdOrder._id}`);
    } catch (err) {
      console.error('Order creation error:', err);
      const msg = err.response?.data?.error || 'Failed to place order.';
      setError(msg);
      addToast(msg, { type: 'error' });
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/cart" className="p-2 rounded-full hover:bg-white text-[#736254] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="font-mono text-xs font-semibold text-[#E4572E] uppercase tracking-wider">
            Final Step
          </span>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A]">Checkout & Address</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Address Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2D6C2] shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#F4EDE0]">
            <MapPin className="w-5 h-5 text-[#E4572E]" />
            <h2 className="font-display font-bold text-xl text-[#4A121A]">Delivery Destination</h2>
          </div>

          {error && (
            <div className="p-3 rounded-[12px] bg-[#E4572E]/10 border border-[#E4572E]/30 text-xs font-semibold text-[#C33C14]">
              {error}
            </div>
          )}

          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#736254] mb-1 font-bold">
                Street Address / Flat / Floor
              </label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                required
                placeholder="e.g. 42 Baker Street, 3rd Floor"
                className="w-full h-11 px-3.5 rounded-[12px] bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#736254] mb-1 font-bold">
                  City
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  placeholder="e.g. Mumbai"
                  className="w-full h-11 px-3.5 rounded-[12px] bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#736254] mb-1 font-bold">
                  Postal PIN Code
                </label>
                <input
                  type="text"
                  value={address.pin}
                  onChange={(e) => setAddress({ ...address, pin: e.target.value })}
                  required
                  placeholder="e.g. 400050"
                  className="w-full h-11 px-3.5 rounded-[12px] bg-[#FAF6EE] border border-[#E2D6C2] text-sm font-mono text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
                />
              </div>
            </div>
          </form>

          {/* Payment Notice Badge */}
          <div className="p-4 rounded-[16px] bg-[#FAF6EE] border border-[#E8DCBE] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#456B4E] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#736254] leading-relaxed">
              <span className="font-bold text-[#4A121A] block mb-0.5">Order Dispatch Guarantee</span>
              Orders are immediately created in the kitchen queue in <code className="font-mono text-[#E4572E]">pending_payment</code> status. Razorpay gateway activates upon order confirmation.
            </div>
          </div>
        </div>

        {/* Right Sticky Order Summary (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-[#FAF6EE] rounded-[24px] p-6 sm:p-7 border border-[#E2D6C2] shadow-md space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-[#DCD0B0]">
              <span className="font-display font-bold text-lg text-[#4A121A]">Final Order Review</span>
              <span className="font-mono text-xs font-bold text-[#456B4E] bg-white px-2.5 py-1 rounded-full border border-[#E2D6C2]">
                {items.length} PIES
              </span>
            </div>

            {/* Itemized List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between items-start text-xs border-b border-[#E8DCBE]/60 pb-2">
                  <div>
                    <div className="font-bold text-[#2C1810]">
                      {item.quantity}x {item.pizza?.name || 'Custom Pie'} ({item.size?.name || 'Medium'})
                    </div>
                    <div className="text-[11px] text-[#736254]">
                      {item.sauce?.name} • {item.cheese?.name}
                    </div>
                    {item.toppings?.length > 0 && (
                      <div className="text-[10px] text-[#E4572E] line-clamp-1">
                        +{item.toppings.map((t) => t.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-sm text-[#2C1810]">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs pt-2 border-t border-[#DCD0B0]">
              <div className="flex justify-between text-[#736254]">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#736254]">
                <span>Delivery</span>
                <span className="font-mono font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-[#736254]">
                <span>Taxes & GST (5%)</span>
                <span className="font-mono font-semibold">₹{tax}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCD0B0] flex justify-between items-baseline">
              <span className="font-display font-bold text-lg text-[#4A121A]">Total Payable</span>
              <span className="font-mono text-3xl font-extrabold text-[#E4572E]">₹{grandTotal}</span>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              variant="customer-primary"
              size="lg"
              loading={placing}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Place Order &rarr;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
