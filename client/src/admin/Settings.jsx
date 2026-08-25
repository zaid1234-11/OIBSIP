import React, { useState } from 'react';
import { Sliders, Shield, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export function Settings() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    deliveryFee: 40,
    freeDeliveryThreshold: 1000,
    taxRate: 5,
    lowStockThreshold: 5,
    razorpayTestMode: true,
    audioAlerts: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Kitchen operational settings saved.', { type: 'success' });
    }, 500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#4A433C]/40">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#F6EEDF]">System & Kitchen Configuration</h1>
          <p className="text-xs font-mono text-[#9E8C7E] mt-1">
            Global delivery thresholds, tax computation rules, and payment gateways
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pricing & Delivery Matrix */}
        <div className="bg-[#2A2421] rounded-[20px] p-6 border border-[#4A433C]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#4A433C]/30">
            <Sliders className="w-5 h-5 text-[#E4572E]" />
            <h2 className="text-lg font-display font-bold text-[#F6EEDF]">Pricing & Delivery Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1 font-bold">
                Standard Delivery Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
              />
              <span className="text-[11px] text-[#736254] mt-1 block">Applied to standard orders under free threshold</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1 font-bold">
                Free Delivery Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
              />
              <span className="text-[11px] text-[#736254] mt-1 block">Orders equal or above this amount get free delivery</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1 font-bold">
                Tax & GST Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
              />
              <span className="text-[11px] text-[#736254] mt-1 block">Restaurant GST applied to subtotal</span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9E8C7E] mb-1 font-bold">
                Low Stock Threshold (Units)
              </label>
              <input
                type="number"
                min="1"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                className="w-full h-11 px-3.5 rounded-[12px] bg-[#1E1A17] border border-[#4A433C] text-sm font-mono text-[#F6EEDF] focus:outline-none focus:border-[#E4572E]"
              />
              <span className="text-[11px] text-[#736254] mt-1 block">Triggers low-stock warning in dashboard cards</span>
            </div>
          </div>
        </div>

        {/* Gateway & Safety */}
        <div className="bg-[#2A2421] rounded-[20px] p-6 border border-[#4A433C]/40 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#4A433C]/30">
            <Shield className="w-5 h-5 text-[#456B4E]" />
            <h2 className="text-lg font-display font-bold text-[#F6EEDF]">Payment Gateway & Security</h2>
          </div>

          <div className="space-y-3 text-xs text-[#9E8C7E]">
            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C]/30">
              <div>
                <span className="font-bold text-[#F6EEDF] block">Razorpay Test Mode</span>
                <span>Active simulation mode. No live credit cards charged.</span>
              </div>
              <span className="font-mono font-bold text-[#456B4E] bg-[#456B4E]/15 px-3 py-1 rounded-full border border-[#456B4E]/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#1E1A17] border border-[#4A433C]/30">
              <div>
                <span className="font-bold text-[#F6EEDF] block">HMAC Signature Verification</span>
                <span>Server-side cryptographic check on webhook and verification payload.</span>
              </div>
              <span className="font-mono font-bold text-[#456B4E] bg-[#456B4E]/15 px-3 py-1 rounded-full border border-[#456B4E]/30">
                ENFORCED
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="admin-primary" size="lg" loading={saving} className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
