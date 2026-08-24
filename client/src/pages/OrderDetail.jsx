import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Receipt, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import OrderTracker from '../components/orders/OrderTracker';
import StatusPill from '../components/ui/StatusPill';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError(err.response?.data?.error || 'Order not found.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <Skeleton variant="card" className="h-64 w-full rounded-[24px]" />
        <Skeleton variant="card" className="h-48 w-full rounded-[24px]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">Order Not Found</h2>
        <p className="text-sm text-[#736254] mt-2">{error || 'Could not locate this order ticket.'}</p>
        <Link to="/orders" className="mt-5 inline-block">
          <Button variant="customer-secondary">View My Orders</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="p-2 rounded-full hover:bg-white text-[#736254] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-extrabold text-[#4A121A]">
                Ticket #{order.orderCode}
              </h1>
              <StatusPill status={order.orderStatus} />
            </div>
            <p className="text-xs text-[#736254] font-mono mt-0.5">
              Placed on {formattedDate}
            </p>
          </div>
        </div>

        <Link to="/menu">
          <Button variant="customer-secondary" size="sm">
            Order Again &rarr;
          </Button>
        </Link>
      </div>

      {/* Live Visual Tracker */}
      <OrderTracker currentStatus={order.orderStatus} />

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Itemized Recipe Receipt (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-[24px] p-6 sm:p-7 border border-[#E2D6C2] shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F4EDE0]">
            <Receipt className="w-5 h-5 text-[#E4572E]" />
            <h3 className="font-display font-bold text-lg text-[#4A121A]">Order Items & Recipe Spec</h3>
          </div>

          <div className="space-y-4 divide-y divide-[#F4EDE0]">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex justify-between items-start text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#2C1810]">
                    {item.quantity}x {item.pizzaName} ({item.sizeName})
                  </div>
                  <div className="text-[11px] text-[#736254]">
                    Sauce: {item.sauceName} • Cheese: {item.cheeseName}
                  </div>
                  {item.toppingNames?.length > 0 && (
                    <div className="text-[11px] text-[#E4572E]">
                      Toppings: {item.toppingNames.join(', ')}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#2C1810]">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                  <div className="text-[10px] font-mono text-[#736254]">
                    ₹{item.unitPrice} each
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Ledger */}
          <div className="pt-4 border-t border-dashed border-[#DCD0B0] space-y-2 text-xs">
            <div className="flex justify-between text-[#736254]">
              <span>Subtotal</span>
              <span className="font-mono font-semibold">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#736254]">
              <span>Delivery Fee</span>
              <span className="font-mono font-semibold">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-[#736254]">
              <span>Taxes & GST (5%)</span>
              <span className="font-mono font-semibold">₹{order.tax}</span>
            </div>
            <div className="pt-3 border-t border-[#DCD0B0] flex justify-between items-baseline">
              <span className="font-display font-bold text-base text-[#4A121A]">Total Locked Price</span>
              <span className="font-mono text-2xl font-extrabold text-[#E4572E]">
                ₹{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Destination Box */}
          <div className="bg-white rounded-[24px] p-6 border border-[#E2D6C2] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#4A121A] font-bold text-sm">
              <MapPin className="w-4 h-4 text-[#E4572E]" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs text-[#736254] leading-relaxed pl-6">
              <p className="font-medium text-[#2C1810]">{order.deliveryAddress?.street}</p>
              <p>{order.deliveryAddress?.city}, PIN {order.deliveryAddress?.pin}</p>
            </div>
          </div>

          {/* Payment Status Box */}
          <div className="bg-[#FAF6EE] rounded-[24px] p-6 border border-[#E2D6C2] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#4A121A] font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#456B4E]" />
              <span>Payment Confirmation</span>
            </div>
            <div className="text-xs text-[#736254] space-y-1 pl-6">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-mono font-bold uppercase text-[#E4572E]">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium text-[#2C1810]">Razorpay Test Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
