import React from 'react';
import { Check } from 'lucide-react';
import usePizzaStore from '../../store/pizzaStore';

export function CheeseStep() {
  const { cheeses, selectedCheese, selectCheese } = usePizzaStore();

  const getCheeseNote = (name) => {
    if (name.includes('Whole Milk Mozzarella')) return 'Classic low-moisture whole milk fiordilatte for that iconic stretch and golden blisters.';
    if (name.includes('Smoked Provolone')) return 'Naturally oak-smoked provolone adding a rich rustic depth.';
    if (name.includes('4-Cheese')) return 'Gourmet blend of Mozzarella, Gorgonzola, Provolone, and aged Parmesan.';
    if (name.includes('Vegan Almond')) return 'Plant-based artisanal almond milk mozzarella with great melt.';
    return 'Signature cheese blend.';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-[#4A121A]">3. Select Cheese Blend</h2>
        <p className="text-xs text-[#736254] mt-1">Carefully portioned to melt without making the crust soggy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cheeses.map((cheese) => {
          const isSelected = selectedCheese?._id === cheese._id;
          return (
            <button
              key={cheese._id}
              type="button"
              onClick={() => selectCheese(cheese)}
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
                <h3 className="font-body font-bold text-base text-[#2C1810]">{cheese.name}</h3>
                <p className="text-xs text-[#736254] mt-1 leading-relaxed">{getCheeseNote(cheese.name)}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8DCBE]/60 flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase text-[#736254]">Price Adjustment</span>
                <span className="font-mono font-bold text-sm text-[#E4572E]">
                  {cheese.priceModifier === 0 ? 'Included' : `+₹${cheese.priceModifier}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CheeseStep;
