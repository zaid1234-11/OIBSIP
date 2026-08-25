import React from 'react';
import { Users, Check } from 'lucide-react';
import usePizzaStore from '../../store/pizzaStore';

export function SizeStep() {
  const { sizes, selectedSize, selectSize } = usePizzaStore();

  const getServing = (name) => {
    if (name.includes('Small')) return 'Serves 1 person • 4 Slices';
    if (name.includes('Large')) return 'Serves 3-4 people • 8 Slices';
    return 'Serves 2 people • 6 Slices';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">1. Select Crust & Size</h2>
        <p className="text-xs text-[#736254] mt-1">All CRUST doughs fermented 48h for optimal hydration and charred airy crumb.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sizes.map((size) => {
          const isSelected = selectedSize?._id === size._id;
          return (
            <button
              key={size._id}
              type="button"
              onClick={() => selectSize(size)}
              className={`p-5 rounded-[20px] text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-2 border-[#E4572E] bg-[#FAF6EE] shadow-md ring-2 ring-[#E4572E]/20'
                  : 'border border-[#E2D6C2] bg-white hover:border-[#DCD0B0] hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#E4572E] text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
              <div>
                <h3 className="font-body font-bold text-lg text-[#2C1810]">{size.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-[#736254] mt-1">
                  <Users className="w-3.5 h-3.5 text-[#E4572E]" />
                  <span>{getServing(size.name)}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8DCBE]/60 flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase text-[#736254]">Base Price</span>
                <span className="font-mono font-bold text-lg text-[#E4572E]">
                  ₹{size.priceModifier}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SizeStep;
