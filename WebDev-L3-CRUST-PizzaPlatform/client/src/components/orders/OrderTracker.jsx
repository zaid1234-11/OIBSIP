import React from 'react';
import { Check, Clock, Flame, Truck, PackageCheck, AlertCircle } from 'lucide-react';

export function OrderTracker({ currentStatus = 'ordered', className = '' }) {
  const steps = [
    { key: 'ordered', label: 'Ordered', icon: Clock, desc: 'Kitchen received ticket' },
    { key: 'kitchen', label: 'In the Oven', icon: Flame, desc: 'Baking at 450°C' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'Driver on the way' },
    { key: 'delivered', label: 'Delivered', icon: PackageCheck, desc: 'Enjoy your hot pizza!' }
  ];

  if (currentStatus === 'cancelled') {
    return (
      <div className="p-6 rounded-[20px] bg-[#E4572E]/10 border border-[#E4572E]/30 flex items-center gap-3 text-[#C33C14]">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div>
          <h4 className="font-bold font-display text-base">Order Cancelled</h4>
          <p className="text-xs mt-0.5">This order has been cancelled and refunded.</p>
        </div>
      </div>
    );
  }

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending_payment':
      case 'ordered':
        return 0;
      case 'kitchen':
        return 1;
      case 'out_for_delivery':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className={`p-6 sm:p-8 rounded-[24px] bg-white border border-[#E2D6C2] shadow-sm space-y-8 ${className}`}>
      <div className="flex justify-between items-center pb-4 border-b border-[#F4EDE0]">
        <div>
          <span className="text-xs font-mono font-semibold text-[#E4572E] uppercase tracking-wider block">
            Live Dispatch Pipeline
          </span>
          <h3 className="text-2xl font-display font-bold text-[#4A121A]">Live Order Tracking</h3>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#FAF6EE] border border-[#E8DCBE] text-[#4A121A] font-bold">
          • Auto-Updating
        </span>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className={`p-4 rounded-[18px] transition-all flex flex-col justify-between relative ${
                isCurrent
                  ? 'bg-[#FAF6EE] border-2 border-[#E4572E] shadow-md ring-2 ring-[#E4572E]/15 scale-102'
                  : isDone
                    ? 'bg-[#456B4E]/10 border border-[#456B4E]/30 text-[#456B4E]'
                    : 'bg-[#FAF6EE]/50 border border-[#E8DCBE] text-[#A89E94] opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#E4572E] text-white shadow-sm'
                      : isDone
                        ? 'bg-[#456B4E] text-white'
                        : 'bg-[#E8DCBE] text-[#736254]'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="font-mono text-xs font-bold">0{idx + 1}</span>
              </div>

              <div>
                <h4 className={`font-display font-bold text-sm ${isCurrent ? 'text-[#4A121A]' : 'text-inherit'}`}>
                  {step.label}
                </h4>
                <p className="text-[11px] text-[#736254] mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTracker;
