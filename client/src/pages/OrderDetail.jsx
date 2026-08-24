import React from 'react';
import { useParams } from 'react-router-dom';
import TicketCard from '../components/ui/TicketCard';

export function OrderDetail() {
  const { id } = useParams();
  const mockOrder = {
    code: 'CR-' + (id || '1048'),
    items: [
      { name: 'Margherita Classica (10")', quantity: 1, price: 299 },
      { name: 'Rustic Pepperoni (12")', quantity: 1, price: 449 },
    ],
    total: 748,
    status: 'kitchen',
    timestamp: '24 Aug 2026, 2:30 PM',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <span className="font-mono text-xs font-semibold text-[#736254] uppercase tracking-wider">Live Ticket Tracking</span>
        <h1 className="text-3xl font-display font-extrabold text-[#4A121A] mt-1">Order #{id || '1048'}</h1>
      </div>

      <TicketCard {...mockOrder} className="mb-8" />

      {/* Progress Steps */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E2D6C2] shadow-sm space-y-6">
        <h3 className="font-display font-bold text-base text-[#4A121A]">Preparation Stages</h3>
        <div className="space-y-4 pl-2">
          {[
            { step: 'Ordered', desc: 'Order received & payment confirmed', state: 'done' },
            { step: 'Kitchen', desc: 'Dough stretched & fired in brick oven', state: 'active' },
            { step: 'Out for delivery', desc: 'Driver dispatched with insulated thermal box', state: 'upcoming' },
            { step: 'Delivered', desc: 'Delivered piping hot to your door', state: 'upcoming' },
          ].map((s, idx) => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.state === 'done'
                    ? 'bg-[#456B4E] text-white'
                    : s.state === 'active'
                      ? 'bg-[#E4572E] text-white animate-pulse'
                      : 'bg-[#E8DCBE] text-[#736254]'
                }`}>
                  {idx + 1}
                </div>
                {idx < 3 && <div className={`w-0.5 h-7 ${s.state === 'done' ? 'bg-[#456B4E]' : 'bg-[#E8DCBE]'}`} />}
              </div>
              <div>
                <div className={`text-sm font-bold ${s.state === 'active' ? 'text-[#E4572E]' : 'text-[#2C1810]'}`}>
                  {s.step}
                </div>
                <div className="text-xs text-[#736254] mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
