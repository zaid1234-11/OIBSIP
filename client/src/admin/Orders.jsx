import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, MapPin, ChefHat, Bike, CheckCircle2, AlertCircle, XCircle, Search, Filter } from 'lucide-react';
import api from '../services/api';
import StatusPill from '../components/ui/StatusPill';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatusFilter = searchParams.get('status') || 'all';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const fetchOrders = async (status = activeStatusFilter) => {
    try {
      setLoading(true);
      const url = status && status !== 'all' ? `/admin/orders?status=${status}` : '/admin/orders';
      const response = await api.get(url);
      setOrders(response.data.orders);
      setError('');
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      setError('Could not load the order queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeStatusFilter);
  }, [activeStatusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order updated to '${newStatus}'.`, { type: 'success' });
      fetchOrders(activeStatusFilter);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update order.', { type: 'error' });
    }
  };

  const getNextStatusAction = (order) => {
    switch (order.orderStatus) {
      case 'pending_payment':
        return {
          label: 'Confirm & Order',
          nextStatus: 'ordered',
          btnClass: 'bg-[#456B4E] hover:bg-[#38563e] text-white',
          icon: CheckCircle2
        };
      case 'ordered':
        return {
          label: 'Send to Kitchen →',
          nextStatus: 'kitchen',
          btnClass: 'bg-[#E4572E] hover:bg-[#c64420] text-white',
          icon: ChefHat
        };
      case 'kitchen':
        return {
          label: 'Out for Delivery →',
          nextStatus: 'out_for_delivery',
          btnClass: 'bg-[#F2B705] hover:bg-[#d4a004] text-[#1E1A17]',
          icon: Bike
        };
      case 'out_for_delivery':
        return {
          label: 'Mark as Delivered ✓✓',
          nextStatus: 'delivered',
          btnClass: 'bg-[#456B4E] hover:bg-[#38563e] text-white',
          icon: CheckCircle2
        };
      default:
        return null;
    }
  };

  const filterTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'ordered', label: 'Ordered' },
    { key: 'kitchen', label: 'In Kitchen' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'pending_payment', label: 'Awaiting Pay' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderCode?.toLowerCase().includes(q) ||
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F6EEDF]">Live Order Queue</h1>
          <p className="text-xs font-mono text-[#9E8C7E] mt-1">
            Dispatch, kitchen oven tracking, and delivery handoffs
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#9E8C7E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#2A2421] border border-[#4A433C]/50 text-xs text-[#F6EEDF] placeholder-[#736254] focus:outline-none focus:border-[#E4572E]"
            />
          </div>
          <Button variant="admin-secondary" size="sm" onClick={() => fetchOrders(activeStatusFilter)}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filterTabs.map((tab) => {
          const isActive = activeStatusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSearchParams({ status: tab.key })}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#E4572E] text-white shadow'
                  : 'bg-[#2A2421] text-[#9E8C7E] hover:text-[#F6EEDF] border border-[#4A433C]/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders Grid (Rendered as Cards) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="card" className="h-72 rounded-[20px]" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#2A2421] rounded-[20px] p-12 text-center border border-[#4A433C]/40 space-y-3">
          <AlertCircle className="w-10 h-10 text-[#9E8C7E] mx-auto opacity-50" />
          <h3 className="font-display font-bold text-lg text-[#F6EEDF]">No Orders Found</h3>
          <p className="text-xs font-mono text-[#9E8C7E] max-w-sm mx-auto">
            {activeStatusFilter !== 'all'
              ? `No active orders currently under status "${activeStatusFilter}".`
              : 'There are no active orders in the database.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const nextAction = getNextStatusAction(order);
            const NextIcon = nextAction?.icon;
            const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order._id}
                className="bg-[#2A2421] rounded-[20px] border-2 border-[#4A433C]/40 hover:border-[#E4572E]/60 transition-all p-5 flex flex-col justify-between shadow-lg space-y-4"
              >
                {/* Card Top: Code, Time, Status */}
                <div className="space-y-3 pb-3 border-b border-[#4A433C]/40">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-display font-extrabold text-xl text-[#F6EEDF] hover:text-[#E4572E] transition-colors"
                        >
                          #{order.orderCode}
                        </Link>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#9E8C7E]">
                          {formattedTime}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#F6EEDF] mt-1">
                        {order.user?.name || 'Customer'}{' '}
                        <span className="text-[11px] text-[#9E8C7E] font-mono font-normal">
                          ({order.user?.email || 'Guest'})
                        </span>
                      </p>
                    </div>
                    <StatusPill status={order.orderStatus} />
                  </div>

                  {/* Payment tag */}
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#9E8C7E]">Payment:</span>
                    <span
                      className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                        order.paymentStatus === 'paid'
                          ? 'bg-[#456B4E]/20 text-[#456B4E]'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items & Recipe Spec */}
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-mono uppercase text-[#9E8C7E] tracking-wider block">
                    Recipe Breakdown ({order.items?.length} items):
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="bg-black/20 p-2.5 rounded-[12px] text-xs space-y-1">
                        <div className="flex justify-between font-bold text-[#F6EEDF]">
                          <span>
                            {item.quantity}x {item.pizzaName}
                          </span>
                          <span className="font-mono text-[#E4572E]">₹{item.unitPrice * item.quantity}</span>
                        </div>
                        <div className="text-[10px] text-[#9E8C7E]">
                          {item.sizeName} • {item.sauceName} • {item.cheeseName}
                        </div>
                        {item.toppingNames?.length > 0 && (
                          <div className="text-[10px] text-[#F2B705]">
                            +{item.toppingNames.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destination */}
                <div className="pt-2 flex items-start gap-1.5 text-[11px] text-[#9E8C7E]">
                  <MapPin className="w-3.5 h-3.5 text-[#E4572E] shrink-0 mt-0.5" />
                  <span className="truncate">
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </span>
                </div>

                {/* Price & Action Row */}
                <div className="pt-3 border-t border-[#4A433C]/40 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-mono text-[#9E8C7E]">Total Ticket:</span>
                    <span className="text-xl font-mono font-extrabold text-[#E4572E]">
                      ₹{order.total}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {nextAction && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order._id, nextAction.nextStatus)}
                        className={`flex-1 py-2.5 px-3 rounded-[12px] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow ${nextAction.btnClass}`}
                      >
                        <NextIcon className="w-4 h-4" />
                        {nextAction.label}
                      </button>
                    )}

                    {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(order._id, 'cancelled')}
                        title="Cancel Order"
                        className="p-2.5 rounded-[12px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
