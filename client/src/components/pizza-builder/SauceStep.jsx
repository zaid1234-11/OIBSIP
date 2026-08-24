import React from 'react';
import { Check } from 'lucide-react';
import usePizzaStore from '../../store/pizzaStore';

export function SauceStep() {
  const { sauces, selectedSauce, selectSauce } = usePizzaStore();

  const getSauceNote = (name) => {
    if (name.includes('San Marzano')) return 'Slow-cooked crushed San Marzano D.O.P. tomatoes, sea salt, oregano.';
    if (name.includes('Garlic Alfredo')) return 'Rich heavy cream, roasted garlic confit, aged parmesan emulsion.';
    if (name.includes('Arrabbiata')) return 'Fiery crushed Calabrian chili sauce with roasted garlic and basil.';
    if (name.includes('BBQ')) return 'Hickory wood smoked molasses sauce with a sweet, tangy finish.';
    return 'Artisanal sauce blend.';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">2. Choose Sauce Base</h2>
        <p className="text-xs text-[#736254] mt-1">Evenly ladled edge-to-edge for harmonious balance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sauces.map((sauce) => {
          const isSelected = selectedSauce?._id === sauce._id;
          return (
            <button
              key={sauce._id}
              type="button"
              onClick={() => selectSauce(sauce)}
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
                <h3 className="font-body font-bold text-base text-[#2C1810]">{sauce.name}</h3>
                <p className="text-xs text-[#736254] mt-1 leading-relaxed">{getSauceNote(sauce.name)}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8DCBE]/60 flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase text-[#736254]">Price Adjustment</span>
                <span className="font-mono font-bold text-sm text-[#E4572E]">
                  {sauce.priceModifier === 0 ? 'Included' : `+₹${sauce.priceModifier}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SauceStep;
