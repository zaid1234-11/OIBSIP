import React, { useEffect, useState } from 'react';
import { Users, Search, RefreshCw, ShoppingBag, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/customers');
      setCustomers(response.data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
      addToast('Failed to load customer list.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  const totalSpendAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrdersAll = customers.reduce((sum, c) => sum + (c.orderCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F6EEDF]">Customer Directory</h1>
          <p className="text-xs font-mono text-[#9E8C7E] mt-1">
            Registered customer accounts, orders placed, and lifetime values
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#9E8C7E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#2A2421] border border-[#4A433C]/50 text-xs text-[#F6EEDF] placeholder-[#736254] focus:outline-none focus:border-[#E4572E]"
            />
          </div>
          <Button variant="admin-secondary" size="sm" onClick={fetchCustomers}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#2A2421] p-5 rounded-[16px] border border-[#4A433C]/40 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-mono text-[#9E8C7E] uppercase block">Total Customers</span>
            <span className="text-2xl font-bold font-mono text-[#F6EEDF] mt-1 block">{customers.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 text-[#E4572E]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#2A2421] p-5 rounded-[16px] border border-[#4A433C]/40 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-mono text-[#9E8C7E] uppercase block">Total Dispatches</span>
            <span className="text-2xl font-bold font-mono text-[#F6EEDF] mt-1 block">{totalOrdersAll}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 text-[#456B4E]">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#2A2421] p-5 rounded-[16px] border border-[#4A433C]/40 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-mono text-[#9E8C7E] uppercase block">Lifetime Value</span>
            <span className="text-2xl font-bold font-mono text-[#E4572E] mt-1 block">₹{totalSpendAll.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 text-[#F2B705]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#2A2421] rounded-[20px] border border-[#4A433C]/40 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 space-y-4">
            <Skeleton variant="card" className="h-12 w-full rounded-lg" />
            <Skeleton variant="card" className="h-12 w-full rounded-lg" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-[#9E8C7E] text-xs font-mono">
            No customers found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#4A433C]/40 text-[11px] font-mono text-[#9E8C7E] uppercase tracking-wider bg-black/20">
                  <th className="py-3.5 px-5 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Verification</th>
                  <th className="py-3.5 px-4 font-semibold">Orders</th>
                  <th className="py-3.5 px-4 font-semibold">Total Spent</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A433C]/20 text-xs text-[#F6EEDF]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-5 font-bold text-sm text-[#F6EEDF]">
                      {cust.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-[#9E8C7E]">
                      {cust.email}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        cust.isVerified
                          ? 'bg-[#456B4E]/20 text-[#456B4E]'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {cust.isVerified ? '✓ Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#F6EEDF]">
                      {cust.orderCount}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#E4572E]">
                      ₹{cust.totalSpent}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-[#9E8C7E]">
                      {new Date(cust.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
