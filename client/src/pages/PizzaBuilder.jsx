import React from 'react';
import Button from '../components/ui/Button';
import BuildShot from '../components/ui/BuildShot';

export function PizzaBuilder() {
  const steps = ['Size', 'Sauce', 'Cheese', 'Toppings'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-extrabold text-[#4A121A]">Pizza Builder</h1>
        <p className="text-sm text-[#736254] mt-1">Construct your pizza layer-by-layer with live kitchen pricing</p>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
              i === 0 ? 'bg-[#E4572E] text-white shadow-sm' : 'bg-[#E8DCBE] text-[#736254]'
            }`}>
              {i + 1}
            </span>
            <span className={`text-sm font-semibold ${i === 0 ? 'text-[#4A121A]' : 'text-[#736254]'}`}>{step}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-[#DCD0B0] mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Builder Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-[20px] p-7 border border-[#E2D6C2] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-display font-bold text-[#4A121A] mb-1">Select Crust Size</h2>
            <p className="text-xs text-[#736254]">All crusts fermented 48h for maximum airy crumb</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Small (8")', serves: '1 person', price: 199, selected: false },
              { label: 'Medium (10")', serves: '2 people', price: 299, selected: true },
              { label: 'Large (12")', serves: '3-4 people', price: 399, selected: false },
            ].map(size => (
              <button
                key={size.label}
                className={`p-4 rounded-[16px] text-left transition-all cursor-pointer ${
                  size.selected
                    ? 'border-2 border-[#E4572E] bg-[#FAF6EE] shadow-sm'
                    : 'border border-[#E2D6C2] bg-white hover:border-[#DCD0B0]'
                }`}
              >
                <div className="font-semibold text-sm text-[#2C1810]">{size.label}</div>
                <div className="text-xs text-[#736254] mt-0.5">{size.serves}</div>
                <div className="font-mono font-bold text-sm text-[#E4572E] mt-2">{'\u20B9'}{size.price}</div>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F4EDE0] flex justify-between items-center">
            <span className="text-xs text-[#736254]">Step 1 of 4: Size & Crust</span>
            <Button variant="customer-primary" size="md">Next: Sauce &rarr;</Button>
          </div>
        </div>

        {/* Right Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <BuildShot size="medium" sauce="tomato" cheese="mozzarella" />

          {/* Ticket Summary Stub */}
          <div className="bg-[#FAF6EE] rounded-[20px] p-6 border border-[#E2D6C2] shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-dashed border-[#DCD0B0]">
              <span className="font-mono text-xs font-semibold text-[#736254] uppercase tracking-wider">Custom Build</span>
              <span className="font-mono text-xs font-bold text-[#E4572E]">TICKET #DRAFT</span>
            </div>
            <div className="py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Medium Crust (10")</span>
                <span className="font-mono font-semibold">{'\u20B9'}299.00</span>
              </div>
              <div className="flex justify-between text-[#736254] text-xs">
                <span>San Marzano Tomato Sauce</span>
                <span className="font-mono">Included</span>
              </div>
              <div className="flex justify-between text-[#736254] text-xs">
                <span>Whole Milk Mozzarella Blend</span>
                <span className="font-mono">Included</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#DCD0B0] flex justify-between items-baseline mb-4">
              <span className="font-bold text-sm text-[#2C1810]">Estimated Total</span>
              <span className="font-mono text-2xl font-bold text-[#E4572E]">{'\u20B9'}299.00</span>
            </div>
            <Button variant="customer-primary" size="md" className="w-full">
              Add build to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaBuilder;
