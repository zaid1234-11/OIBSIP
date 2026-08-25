import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Users, AlertTriangle, ArrowRight, Clock, ChefHat, Bike, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import StatusPill from '../components/ui/StatusPill';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Could not retrieve overview data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusMove = async (orderId, nextStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: nextStatus });
      addToast(`Order moved to '${nextStatus}'.`, { type: 'success' });
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update status.', { type: 'error' });
    }
  };

  const getNextStatusAction = (order) => {
    switch (order.orderStatus) {
      case 'pending_payment':
        return { label: 'Confirm & Order', next: 'ordered', icon: CheckCircle2 };
      case 'ordered':
        return { label: 'Send to Kitchen', next: 'kitchen', icon: ChefHat };
      case 'kitchen':
        return { label: 'Out for Delivery', next: 'out_for_delivery', icon: Bike };
      case 'out_for_delivery':
        return { label: 'Mark Delivered', next: 'delivered', icon: CheckCircle2 };
      default:
        return null;
    }
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="w-48 h-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} variant="card" className="h-32 rounded-[16px]" />
          ))}
        </div>
        <Skeleton variant="card" className="h-64 rounded-[16px]" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Today's Orders",
      value: stats?.todayOrders || 0,
      icon: ShoppingBag,
      color: 'text-[#E4572E]',
      bg: 'bg-[#E4572E]/10',
      mono: true
    },
    {
      label: "Realized Revenue",
      value: `₹${(stats?.todayRevenue || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'text-[#456B4E]',
      bg: 'bg-[#456B4E]/10',
      mono: true
    },
    {
      label: "Registered Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-[#F6EEDF]',
      bg: 'bg-white/5',
      mono: true
    },
    {
      label: "Low Stock Alerts",
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: stats?.lowStockCount > 0 ? 'text-[#F2B705]' : 'text-[#456B4E]',
      bg: stats?.lowStockCount > 0 ? 'bg-[#F2B705]/10' : 'bg-[#456B4E]/10',
      mono: true,
      highlight: stats?.lowStockCount > 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F6EEDF]">Kitchen Command Dashboard</h1>
          <p className="text-xs font-mono text-[#9E8C7E] mt-1">Real-time oven throughput & inventory status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="admin-secondary" size="sm" onClick={fetchStats}>
            Refresh Live Data
          </Button>
          <Link to="/admin/orders">
            <Button variant="admin-primary" size="sm">
              Open Full Queue &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-[#2A2421] rounded-[16px] p-5 border border-[#4A433C]/40 hover:border-[#E4572E]/40 transition-all shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono font-semibold text-[#9E8C7E] uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className={`text-3xl font-bold ${s.mono ? 'font-mono' : ''} ${s.color}`}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Queue Pipeline Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'pending_payment', label: 'Awaiting Pay', count: stats?.statusCounts?.pending_payment || 0, color: 'border-yellow-500/30 text-yellow-400' },
          { key: 'ordered', label: 'New in Queue', count: stats?.statusCounts?.ordered || 0, color: 'border-blue-500/30 text-blue-400' },
          { key: 'kitchen', label: 'In the Oven', count: stats?.statusCounts?.kitchen || 0, color: 'border-[#F2B705]/40 text-[#F2B705]' },
          { key: 'out_for_delivery', label: 'Out on Bike', count: stats?.statusCounts?.out_for_delivery || 0, color: 'border-[#E4572E]/40 text-[#E4572E]' },
          { key: 'delivered', label: 'Delivered', count: stats?.statusCounts?.delivered || 0, color: 'border-[#456B4E]/40 text-[#456B4E]' },
          { key: 'cancelled', label: 'Cancelled', count: stats?.statusCounts?.cancelled || 0, color: 'border-red-500/30 text-red-400' },
        ].map((item) => (
          <Link
            key={item.key}
            to={`/admin/orders?status=${item.key}`}
            className={`bg-[#2A2421] p-3.5 rounded-[14px] border ${item.color} hover:bg-white/5 transition-all text-center block`}
          >
            <span className="text-[10px] font-mono text-[#9E8C7E] block uppercase tracking-wider">{item.label}</span>
            <span className="text-xl font-mono font-bold mt-1 block">{item.count}</span>
          </Link>
        ))}
      </div>

      {/* Live Recent Orders List */}
      <div className="bg-[#2A2421] rounded-[16px] p-6 border border-[#4A433C]/40 space-y-4 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-[#4A433C]/40">
          <div>
            <h2 className="text-lg font-display font-bold text-[#F6EEDF]">Live Active Order Queue</h2>
            <p className="text-xs font-mono text-[#9E8C7E]">Recent tickets requiring oven or dispatch action</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-[#E4572E] hover:underline font-mono flex items-center gap-1">
            View All ({stats?.totalOrders || 0}) &rarr;
          </Link>
        </div>

        {(!stats?.recentOrders || stats.recentOrders.length === 0) ? (
          <div className="py-12 text-center text-[#9E8C7E] text-xs font-mono">
            No live orders found. New customer orders will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#4A433C]/40 text-[11px] font-mono text-[#9E8C7E] uppercase tracking-wider">
                  <th className="py-3 px-3">Ticket</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items & Recipe</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A433C]/20 text-xs text-[#F6EEDF]">
                {stats.recentOrders.map((ord) => {
                  const action = getNextStatusAction(ord);
                  const Icon = action?.icon;
                  return (
                    <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#E4572E]">
                        <Link to={`/admin/orders/${ord._id}`} className="hover:underline">
                          #{ord.orderCode}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold">{ord.user?.name || 'Customer'}</div>
                        <div className="text-[10px] text-[#9E8C7E] font-mono">{ord.user?.email || 'Guest'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono">{ord.items?.length} item(s)</span>
                        <div className="text-[10px] text-[#9E8C7E] truncate max-w-[200px]">
                          {ord.items?.map(i => `${i.quantity}x ${i.pizzaName}`).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#F6EEDF]">
                        ₹{ord.total}
                      </td>
                      <td className="py-3 px-3">
                        <StatusPill status={ord.orderStatus} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        {action ? (
                          <button
                            type="button"
                            onClick={() => handleQuickStatusMove(ord._id, action.next)}
                            className="px-3 py-1.5 rounded-lg bg-[#E4572E] hover:bg-[#c64420] text-white text-[11px] font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow"
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {action.label}
                          </button>
                        ) : (
                          <span className="text-[11px] font-mono text-[#9E8C7E]">✓ Finished</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
