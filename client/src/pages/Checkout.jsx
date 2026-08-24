import React from 'react';
import Button from '../components/ui/Button';

export function Checkout() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-extrabold text-[#4A121A] mb-8">Checkout & Dispatch</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Address form */}
        <div className="lg:col-span-7 bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-4">
          <h2 className="text-xl font-display font-bold text-[#4A121A] mb-2">Delivery Address</h2>
          {['Full Street Address', 'Apartment / Suite / Landmark', 'City', 'PIN Code'].map(field => (
            <div key={field}>
              <label className="block text-xs font-mono font-medium text-[#736254] mb-1.5 uppercase">{field}</label>
              <input
                type="text"
                placeholder={field}
                className="w-full h-11 px-3.5 rounded-full bg-[#FAF6EE] border border-[#E2D6C2] text-sm text-[#2C1810] focus:outline-none focus:border-[#E4572E]"
                disabled
              />
            </div>
          ))}
        </div>

        {/* Order Summary Stub */}
        <div className="lg:col-span-5 bg-[#FAF6EE] rounded-[20px] p-6 border border-[#E2D6C2] shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-dashed border-[#DCD0B0]">
            <span className="font-mono text-xs font-bold text-[#736254] uppercase">Order Summary</span>
            <span className="font-mono text-xs font-bold text-[#E4572E]">0 ITEMS</span>
          </div>
          <div className="space-y-2 text-sm text-[#736254]">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{'\u20B9'}0.00</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span className="font-mono">{'\u20B9'}0.00</span></div>
            <div className="flex justify-between"><span>Taxes (5%)</span><span className="font-mono">{'\u20B9'}0.00</span></div>
          </div>
          <div className="pt-3 border-t border-[#DCD0B0] flex justify-between items-baseline">
            <span className="font-bold text-base text-[#2C1810]">Total Payable</span>
            <span className="font-mono text-2xl font-bold text-[#E4572E]">{'\u20B9'}0.00</span>
          </div>
          <Button variant="customer-primary" size="lg" className="w-full mt-2" disabled>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
