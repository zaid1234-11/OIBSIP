import React from 'react';
import { X, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import Button from './Button';

export function MockPaymentModal({
  isOpen,
  amount = 0,
  orderCode = '',
  onSuccess,
  onFailure,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6EE] rounded-[24px] border-2 border-[#4A121A] w-full max-w-md overflow-hidden shadow-2xl text-[#2C1810]">
        {/* Header Banner */}
        <div className="bg-[#4A121A] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="font-display font-bold text-sm tracking-wider uppercase">
                Razorpay Secure Test Gateway
              </h3>
              <p className="text-[10px] font-mono text-[#FAF6EE]/75">SIMULATION ENVIRONMENT</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-white/10 text-[#FAF6EE]/80 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1.5 bg-[#FAF6EE] border border-[#E8DCBE] p-4 rounded-[16px]">
            <span className="text-xs font-mono text-[#736254] uppercase tracking-wider block">
              Dispatched Ticket Code
            </span>
            <span className="font-display font-extrabold text-2xl text-[#4A121A] block">
              {orderCode}
            </span>
            <span className="text-xs font-mono text-[#736254]">Payable Amount</span>
            <div className="font-mono font-extrabold text-3xl text-[#E4572E]">
              ₹{(amount / 100).toFixed(2)}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono text-[#736254] uppercase font-bold tracking-wider block">
              Choose Test Action:
            </span>

            {/* Success Button */}
            <button
              type="button"
              onClick={() => onSuccess(`pay_mock_${Date.now()}`)}
              className="w-full p-4 rounded-[16px] bg-[#456B4E] text-white hover:bg-[#38563e] shadow transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div>
                <h4 className="font-bold text-sm">Simulate Payment Success</h4>
                <p className="text-[10px] text-white/80 mt-0.5">Signature verified server-side, flags paid & ordered</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Failure Button */}
            <button
              type="button"
              onClick={() => onFailure('Mock payment rejected by user/bank')}
              className="w-full p-4 rounded-[16px] bg-[#E4572E] text-white hover:bg-[#c64420] shadow transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div>
                <h4 className="font-bold text-sm">Simulate Payment Failure</h4>
                <p className="text-[10px] text-white/85 mt-0.5">Signature rejected, keeps status in pending_payment</p>
              </div>
              <ShieldAlert className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full p-3.5 rounded-[16px] border border-[#E2D6C2] bg-white hover:bg-[#FAF6EE] text-sm text-[#736254] hover:text-[#4A121A] transition-all flex items-center justify-between text-left cursor-pointer group"
            >
              <div>
                <h4 className="font-semibold text-xs">Simulate Cancel / Dismiss</h4>
                <p className="text-[9px] text-[#9E8C7E] mt-0.5">Closes modal dialog without submitting credentials</p>
              </div>
              <HelpCircle className="w-4 h-4 text-[#736254]" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF6EE] border-t border-[#E8DCBE] p-4 text-center text-[10px] text-[#9E8C7E] font-mono">
          🔒 Secured by Razorpay Sandbox • Verified Server-Side
        </div>
      </div>
    </div>
  );
}

export default MockPaymentModal;
