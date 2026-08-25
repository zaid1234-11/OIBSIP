import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Receipt, CheckCircle2, ChefHat, Bike, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import StatusPill from '../components/ui/StatusPill';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToast();

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
      setError('');
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err.response?.data?.error || 'Order not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      addToast(`Order status updated to '${newStatus}'.`, { type: 'success' });
      fetchOrder();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update status.', { type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-64 rounded-[20px]" />
        <Skeleton variant="card" className="h-48 rounded-[20px]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#2A2421] rounded-[20px] p-12 text-center border border-[#4A433C]/40 space-y-4">
        <AlertCircle className="w-12 h-12 text-[#9E8C7E] mx-auto opacity-50" />
        <h2 className="text-xl font-display font-bold text-[#F6EEDF]">Order Not Found</h2>
        <p className="text-xs font-mono text-[#9E8C7E]">{error || 'Could not locate order in database.'}</p>
        <Link to="/admin/orders">
          <Button variant="admin-secondary" size="sm">
            Back to Queue
          </Button>
        </Link>
      </div>
    );
  }

  const statuses = [
    { key: 'pending_payment', label: 'Awaiting Payment' },
    { key: 'ordered', label: 'Ordered' },
    { key: 'kitchen', label: 'In Kitchen' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#9E8C7E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-extrabold text-[#F6EEDF]">
                Ticket #{order.orderCode}
              </h1>
              <StatusPill status={order.orderStatus} />
            </div>
            <p className="text-xs font-mono text-[#9E8C7E] mt-0.5">
              Customer: {order.user?.name} ({order.user?.email})
            </p>
          </div>
        </div>

        {/* Status manual override dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-[#9E8C7E]">Change Status:</label>
          <select
            value={order.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="px-3 py-2 rounded-lg bg-[#1E1A17] border border-[#4A433C] text-xs font-mono font-bold text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
          >
            {statuses.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column: items & recipe (7 cols) */}
        <div className="md:col-span-7 bg-[#2A2421] rounded-[20px] p-6 border border-[#4A433C]/40 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#4A433C]/30 text-[#F6EEDF] font-bold">
            <Receipt className="w-5 h-5 text-[#E4572E]" />
            <span>Recipe Instructions & Items</span>
          </div>

          <div className="space-y-3 divide-y divide-[#4A433C]/20">
            {order.items?.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex justify-between items-start text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-[#F6EEDF]">
                    {item.quantity}x {item.pizzaName} ({item.sizeName})
                  </div>
                  <div className="text-[11px] text-[#9E8C7E]">
                    Sauce: {item.sauceName} • Cheese: {item.cheeseName}
                  </div>
                  {item.toppingNames?.length > 0 && (
                    <div className="text-[11px] text-[#F2B705]">
                      Toppings: {item.toppingNames.join(', ')}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-[#E4572E]">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                  <div className="text-[10px] font-mono text-[#9E8C7E]">
                    ₹{item.unitPrice} ea
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Ledger */}
          <div className="pt-4 border-t border-dashed border-[#4A433C]/40 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[#9E8C7E]">
              <span>Subtotal</span>
              <span className="text-[#F6EEDF]">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#9E8C7E]">
              <span>Delivery Fee</span>
              <span className="text-[#F6EEDF]">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-[#9E8C7E]">
              <span>Taxes (5%)</span>
              <span className="text-[#F6EEDF]">₹{order.tax}</span>
            </div>
            <div className="pt-3 border-t border-[#4A433C]/40 flex justify-between items-baseline text-base font-bold">
              <span className="text-[#F6EEDF]">Total Locked Amount</span>
              <span className="text-2xl font-extrabold text-[#E4572E]">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Right column: Delivery, Payment, and Status Timeline (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Destination */}
          <div className="bg-[#2A2421] rounded-[20px] p-5 border border-[#4A433C]/40 space-y-2">
            <div className="flex items-center gap-2 text-[#F6EEDF] font-bold text-xs">
              <MapPin className="w-4 h-4 text-[#E4572E]" />
              <span>Customer Address</span>
            </div>
            <div className="text-xs text-[#9E8C7E] pl-6 leading-relaxed">
              <p className="font-medium text-[#F6EEDF]">{order.deliveryAddress?.street}</p>
              <p>{order.deliveryAddress?.city}, PIN {order.deliveryAddress?.pin}</p>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-[#2A2421] rounded-[20px] p-5 border border-[#4A433C]/40 space-y-2">
            <div className="flex items-center gap-2 text-[#F6EEDF] font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#456B4E]" />
              <span>Payment Confirmation</span>
            </div>
            <div className="text-xs text-[#9E8C7E] pl-6 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold uppercase text-[#E4572E]">{order.paymentStatus}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between text-[10px]">
                  <span>Txn ID:</span>
                  <span className="truncate max-w-[120px]">{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Trail Timeline */}
          <div className="bg-[#2A2421] rounded-[20px] p-5 border border-[#4A433C]/40 space-y-3">
            <div className="flex items-center gap-2 text-[#F6EEDF] font-bold text-xs">
              <Clock className="w-4 h-4 text-[#F2B705]" />
              <span>Status History Audit Trail</span>
            </div>
            <div className="space-y-2 pl-6">
              {order.statusHistory?.map((hist, idx) => (
                <div key={idx} className="flex justify-between text-[11px] font-mono border-l border-[#4A433C] pl-2 py-0.5">
                  <span className="capitalize text-[#F6EEDF] font-semibold">{hist.status.replace('_', ' ')}</span>
                  <span className="text-[#9E8C7E] text-[10px]">
                    {new Date(hist.changedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
