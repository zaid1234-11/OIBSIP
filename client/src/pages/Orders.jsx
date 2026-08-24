import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Package } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import StatusPill from '../components/ui/StatusPill';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';

export function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">Sign In Required</h2>
        <p className="text-sm text-[#736254] mt-2">Please sign in to view your past orders and active tickets.</p>
        <Link to="/login" state={{ from: { pathname: '/orders' } }} className="mt-5 inline-block">
          <Button variant="customer-primary">Sign In &rarr;</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        <Skeleton variant="card" className="h-32 w-full rounded-[20px]" />
        <Skeleton variant="card" className="h-32 w-full rounded-[20px]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <EmptyState
          icon="📦"
          title="No orders placed yet"
          description="You haven't placed any pizza orders yet. Explore our handcrafted menu or build your own pie."
          actionText="Explore Menu"
          actionHref="/menu"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <span className="font-mono text-xs font-semibold text-[#E4572E] uppercase tracking-wider">
            Ticket Archive
          </span>
          <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mt-1">Order History</h1>
          <p className="text-sm text-[#736254] mt-1">
            Track past and active wood-fired oven dispatches.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={order._id}
              className="p-6 rounded-[22px] bg-white border border-[#E2D6C2] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-lg text-[#4A121A]">
                    {order.orderCode}
                  </span>
                  <StatusPill status={order.orderStatus} />
                  <span className="text-xs text-[#736254] font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E4572E]" /> {formattedDate}
                  </span>
                </div>

                <div className="text-xs text-[#736254]">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {idx > 0 && ' • '}
                      <strong>{item.quantity}x</strong> {item.pizzaName} ({item.sizeName})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#F4EDE0]">
                <div className="text-left md:text-right">
                  <div className="text-xs text-[#736254] uppercase font-mono">Total Paid</div>
                  <div className="font-mono font-bold text-xl text-[#E4572E]">
                    ₹{order.total}
                  </div>
                </div>

                <Link to={`/order/${order._id}`}>
                  <Button variant="customer-secondary" size="sm" className="flex items-center gap-1">
                    Track Order <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
